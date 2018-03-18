const {
    getCurrentTimestamp,
    logInfo,
    logError,
} = require('../utils/utils')
const {
    SocketEvents,
    GamePhases,
    PlayerAffilications,
    ErrorMessages,
    ErrorTypes,
    ErrorMappedMessages,
    PlayerRole,
    PolicyCards,
    GlobalRoomName,
    PlayerBoards,
} = require('../Dictionary')
const { isNil, includes, find, map, pick, get, mapValues, partial, partialRight, cloneDeep } = require('lodash')
const ClientVerificationHof = require('../utils/ClientVerificationHof')
const RoomsManager = new (require('../utils/RoomsManager'))()
const SocketEventsUtils = require('../utils/SocketEventsUtils')
const PhaseSocketEvents = require('./PhaseSocketEvents')

module.exports = function (io) {
    const socketEventsUtils = SocketEventsUtils(io, RoomsManager)
    const phaseSocketEvents = PhaseSocketEvents(io, RoomsManager)
    const socketEvents = {
        checkForImmediateSuperpowersOrContinue: (socket) => {
            const fascistPolicyCount = RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)
            const playerboardType = RoomsManager.getPlayerboardType(socket.currentRoom)
            if (fascistPolicyCount === 1 && playerboardType === PlayerBoards.LargeBoard) {
                phaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
            } else if (fascistPolicyCount === 2 && playerboardType !== PlayerBoards.SmallBoard) {
                phaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
            } else if (fascistPolicyCount === 3) {
                if (playerboardType === PlayerBoards.SmallBoard) {
                    // President will see top 3 cards from the drawPile deck
                    phaseSocketEvents.startPeekCardsPhase(socket)
                } else {
                    // President will designate next president superpower
                    phaseSocketEvents.startDesignateNextPresidentPhase(socket)
                }
            // 4th power is always kill on each board
            } else if (fascistPolicyCount === 4) {
                phaseSocketEvents.startKillPhase(socket)
            // 5th power is always kill AND veto power unlock
            } else if (fascistPolicyCount === 5) {
                RoomsManager.toggleVeto(socket.currentRoom)
                socketEventsUtils.sendMessage(socket, { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' })
                phaseSocketEvents.startKillPhase(socket)
            } else {
                socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
            }
        },
        triggerVetoPrompt: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.ServerWaitingForVeto)
            RoomsManager.clearVetoVotes(socket.currentRoom)

            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const chancellorEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
            presidentEmit(SocketEvents.ServerWaitingForVeto)
            chancellorEmit(SocketEvents.ServerWaitingForVeto)
            const onGameResume = (socket) => {
                phaseSocketEvents.checkIfGameShouldFinish(socket, () => {
                    phaseSocketEvents.startChancellorChoicePhase(socket);
                })
            }
            socketEventsUtils.resumeGame(
                socket,
                {
                    delay: 30000,
                    func: onGameResume,
                    customMessage: 'Due to veto power, the president and chancellor can now together veto the enacted policy. Next phase will begin in 30 seconds (assuming no veto will be reported)...',
                },
            )
        },

        // protect it that it can only be fired by president OR chancellor ONCE
        veto: (socket) => {
            const gamePhase = RoomsManager.getGamePhase(socket.currentRoom)
            if (gamePhase !== GamePhases.ServerWaitingForVeto) {
                logError(socket, 'Player tried to veto when the server was not waiting for it!')
                socketEventsUtils.sendError(socket, 'You cannot veto right now!')
                return
            }
            const vetoVotes = RoomsManager.getVetoVotes(socket.currentRoom)
            const playerRole = RoomsManager.getPlayerRole(socket.currentRoom, socket.currentPlayerName)
            if (includes(vetoVotes, playerRole)) {
                logError(socket, 'Player tried to vote twice!')
                socketEventsUtils.sendError(socket, 'You cannot veto twice!')
                return
            }
            if (!includes([PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT], playerRole)) {
                logError(socket, `Player with role ${playerRole} tried to veto - only president and chancellor are allowed to!`)
                socketEventsUtils.sendError(socket, 'You must be a president or a chancellor to veto!')
                return
            }
            RoomsManager.addVetoVote(socket.currentRoom, socket.currentPlayerName)

            const roleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'president' : 'chancellor'
            if (RoomsManager.didVetoSucceed(socket.currentRoom)) {
                RoomsManager.setGamePhase(socket.currentRoom, GamePhases.ServerAcceptedVeto)
                socketEventsUtils.sendMessage(socket, { content: `The ${roleString} invoked veto for the enacted policy as well! The enacted policy has been rejected!` })
                socketEventsUtils.clearNextPhaseTimeout()
                RoomsManager.discardPolicyByVeto(socket.currentRoom)
                socketEventsUtils.checkIfTrackerPositionShouldUpdate(socket, false)

                phaseSocketEvents.checkIfGameShouldFinish(socket, () => {
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.SyncPolicies, {
                        data: {
                            facist: RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy),
                            liberal: RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.LiberalPolicy),
                        },
                    })

                    socketEventsUtils.resumeGame(socket, { delay: 5000, func: phaseSocketEvents.startChancellorChoicePhase })
                })
            } else {
                const missingVetoRoleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'chancellor' : 'president'
                socketEventsUtils.sendMessage(socket, { content: `The ${roleString} invoked veto for the enacted policy! Will the ${missingVetoRoleString} call veto as well?` })
            }
        },

        disconnect: (socket) => {
            if (socket.currentRoom && RoomsManager.isRoomPresent(socket.currentRoom)) {
                const roomOwnerName = RoomsManager.getRoomOwner(socket.currentRoom).playerName

                RoomsManager.removePlayer(socket.currentRoom, socket.currentPlayerName)
                io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_LEAVE_ROOM, {
                    data: {
                        timestamp: getCurrentTimestamp(),
                        playerName: socket.currentPlayerName,
                    },
                })

                if (socket.currentPlayerName === roomOwnerName) {
                    const newOwner = RoomsManager.findNewRoomOwner(socket.currentRoom)
                    if (!isNil(newOwner)) {
                        const roomDetails = RoomsManager.getRoomDetails(socket.currentRoom)
                        newOwner.emit(SocketEvents.CLIENT_GET_ROOM_DATA, { data: roomDetails })

                        if (newOwner.affiliation === PlayerAffilications.FACIST_AFFILIATION
                            || newOwner.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
                            const playersCount = RoomsManager.getPlayersCount(socket.currentRoom)
                            const fascists = RoomsManager.getFacists(socket.currentRoom)
                            socketEventsUtils.sendBecomeFascist(newOwner, playersCount, fascists)
                        }
                        newOwner.emit(SocketEvents.CLIENT_SEND_MESSAGE, {
                            data: {
                                content: 'You have become the new owner of this room!',
                                author: null,
                                timestamp: getCurrentTimestamp(),
                            },
                        })
                    } else {
                        io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                            data: {
                                roomName: socket.currentRoom,
                                room: null,
                            },
                        })
                        RoomsManager.removeRoom(socket.currentRoom)
                        logInfo(socket, 'The room was permanently removed!')
                    }
                }
            }

            RoomsManager.removePlayerFromPlayersList(socket.currentPlayerName)
            socketEventsUtils.switchRooms(socket, socket.currentRoom, '')
            socket.currentPlayerName = ''
        },

        createRoom: (socket, { roomName, maxPlayers, password }) => {
            // if the room does not exist, create it
            if (roomName && !RoomsManager.isRoomPresent(roomName)) {
                RoomsManager.initializeRoom(roomName, socket.currentPlayerName, maxPlayers, password)

                io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                    data: {
                        roomName,
                        room: RoomsManager.getRoomDetailsForLobby(roomName),
                    },
                })
                socketEvents.joinRoom(socket, { roomName })
            } else {
                logError(socket, 'Selected room is already present! Cannot create a duplicate!')
                socket.emit(SocketEvents.CLIENT_ERROR, {
                    error: 'You cannot create duplicate of this room!',
                })
            }
        },

        joinRoom: (socket, { roomName }) => {
            if (!roomName || socket.currentRoom !== GlobalRoomName || !RoomsManager.isRoomPresent(roomName)) {
                logError(socket, 'Player tried to enter nonexistent room!')
                socketEventsUtils.sendError(socket, 'The room does not exist!')
                return
            }

            if (RoomsManager.isInBlackList(roomName, socket.currentPlayerName)) {
                logInfo(socket, 'Banned player tried to enter the room!')
                socketEventsUtils.sendError(socket, 'You are BANNED in this room by the owner!')
                return
            }

            const addingError = RoomsManager.addPlayer(roomName, socket.currentPlayerName, socket)

            if (addingError !== undefined) {
                socketEventsUtils.sendError(socket, ErrorMappedMessages[addingError])
                return
            }

            socketEventsUtils.switchRooms(socket, socket.currentRoom, roomName)

            const roomDetails = RoomsManager.getRoomDetails(roomName)

            socket.emit(SocketEvents.AllowEnteringRoom, { data: { roomName: socket.currentRoom } })
            socket.emit(SocketEvents.CLIENT_GET_ROOM_DATA, { data: roomDetails })

            io.sockets.in(roomName).emit(SocketEvents.CLIENT_JOIN_ROOM, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    player: RoomsManager.getPlayerInfo(roomName, socket.currentPlayerName),
                },
            })
        },

        vote: (socket, { value }) => {
            RoomsManager.vote(socket.currentRoom, socket.currentPlayerName, value)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_NEWVOTE, {
                data: {
                    playerName: socket.currentPlayerName,
                    remaining: RoomsManager.getRemainingVotesCount(socket.currentRoom),
                    timestamp: getCurrentTimestamp(),
                },
            })
            if (RoomsManager.didAllVote(socket.currentRoom)) {
                const hasVotingSucceed = RoomsManager.getVotingResult(socket.currentRoom)
                const votingResultMessage = `Voting completed! ${hasVotingSucceed
                    ? `${socket.currentPlayerName} has become the new chancellor!`
                    : 'The proposal has been rejected!'}
                `
                socketEventsUtils.sendMessage(socket, { content: votingResultMessage })

                socketEventsUtils.checkIfTrackerPositionShouldUpdate(socket, hasVotingSucceed)

                if (hasVotingSucceed) {
                    RoomsManager.setChancellor(socket.currentRoom)
                    phaseSocketEvents.checkIfGameShouldFinish(socket, () => {
                        socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startPresidentPolicyChoice })
                    })
                } else {
                    phaseSocketEvents.checkIfGameShouldFinish(socket, () => {
                        socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
                    })
                }

                io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_REVEAL, {
                    data: {
                        votes: RoomsManager.getVotes(socket.currentRoom),
                        timestamp: getCurrentTimestamp(),
                        newChancellor: (hasVotingSucceed
                            ? RoomsManager.getChancellor(socket.currentRoom).playerName
                            : null
                        ),
                    },
                })
            }
        },

        choosePolicy: (socket, { choice }) => {
            const { gamePhase } = RoomsManager.getRoomDetails(socket.currentRoom)
            let drawnCards = RoomsManager.getDrawnCards(socket.currentRoom)
            if (includes(drawnCards, choice)) {
                const president = RoomsManager.getPresident(socket.currentRoom)
                const chancellor = RoomsManager.getChancellor(socket.currentRoom)
                if (gamePhase === GamePhases.PresidentPolicyChoice && president.playerName === socket.currentPlayerName) {
                    socketEvents.choosePolicyPresident(socket, choice, drawnCards, chancellor.playerName)
                } else if (gamePhase === GamePhases.ChancellorPolicyChoice && chancellor.playerName === socket.currentPlayerName) {
                    socketEvents.choosePolicyChancellor(socket, choice)
                } else {
                    console.error('Cheater!')
                    // cheating (bad role tried to choose)? 
                }
            } else {
                console.error('Cheater!')
                // cheating (sent card was not in collection)! 
            }
        },

        choosePolicyChancellor: (socket, choice) => {
            socketEventsUtils.enactPolicy(socket, choice)

            const isVetoUnlocked = RoomsManager.isVetoUnlocked(socket.currentRoom)
            if (isVetoUnlocked) {
                socketEvents.triggerVetoPrompt(socket)
            } else if (choice === PolicyCards.FacistPolicy) {
                socketEvents.checkForImmediateSuperpowersOrContinue(socket)
            } else {
                phaseSocketEvents.checkIfGameShouldFinish(socket, () => {
                    socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
                });
            }
        },

        choosePolicyPresident: (socket, choice, drawnCards, chancellorName) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.ChancellorPolicyChoice)
            const chancellorEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.ChancellorChoosePolicy, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    chancellorName,
                },
            })
            RoomsManager.discardPolicy(socket.currentRoom, choice)
            chancellorEmit(SocketEvents.ChoosePolicy, {
                data: {
                    policyCards: drawnCards,
                    title: 'Choose policy to enact',
                },
            })
        },

        killPlayer: (socket, { playerName }) => {
            RoomsManager.killPlayer(socket.currentRoom, playerName)
            const hitler = RoomsManager.getHitler(socket.currentRoom)
            const wasHitler = hitler.playerName === playerName
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PlayerKilled, {
                data: {
                    wasHitler,
                    playerName,
                    timestamp: getCurrentTimestamp(),
                },
            })

            phaseSocketEvents.checkIfGameShouldFinish(socket, () => {
                socketEventsUtils.resumeGame(socket, { delay: 4000, func: phaseSocketEvents.startChancellorChoicePhase })
            })
        },
        kickPlayer: (socket, { playerName }, permanently = false) => {
            const hasGameBegan = RoomsManager.getGamePhase(socket.currentRoom) !== GamePhases.GAME_PHASE_NEW
            const isOverlaysHidingNeeded = hasGameBegan && (
                socketEvents.kickIfHitler(socket, playerName)
                || socketEvents.kickIfPresident(socket, playerName)
            )

            RoomsManager.kickPlayer(socket.currentRoom, playerName, permanently)

            io.sockets.in(socket.currentRoom).emit(SocketEvents.PlayerKicked, {
                data: {
                    playerName,
                    timestamp: getCurrentTimestamp(),
                    wasBanned: permanently,
                    isOverlaysHidingNeeded,
                },
            })
            const kickedSocket = find(io.sockets.in(socket.currentRoom).sockets, { currentPlayerName: playerName })
            socketEventsUtils.switchRooms(kickedSocket, socket.currentRoom, GlobalRoomName)
        },
        kickIfPresident: (socket, playerName) => {
            const presidentName = get(RoomsManager.getPresident(socket.currentRoom), 'playerName')
            if (playerName !== presidentName) return false;
            
            RoomsManager.discardAllCards(socket.currentRoom)
            RoomsManager.chooseNextPresident(socket.currentRoom)
            RoomsManager.initializeVoting(socket.currentRoom) // resets chancellor player name
            RoomsManager.setChancellor(socket.currentRoom)
            socketEventsUtils.resumeGame(socket, { delay: 1000, func: phaseSocketEvents.startChancellorChoicePhase })
            return true;
        },
        kickIfHitler: (socket, playerName) => {
            const hitlerName = get(RoomsManager.getHitler(socket.currentRoom), 'playerName')
            return playerName === hitlerName
        },
        selectName: (socket, { userName }) => {
            // deselecting name
            if (!userName) {
                RoomsManager.removePlayerFromPlayersList(socket.currentPlayerName)
                socketEventsUtils.switchRooms(socket, GlobalRoomName, '')
                socket.emit(SocketEvents.SelectName, { data: { userName: '' } })
                socket.currentPlayerName = ''
            // selecting name
            } else if (!RoomsManager.isInPlayersList(userName)) {
                RoomsManager.addPlayerToPlayersList(userName)
                socket.emit(SocketEvents.SelectName, { data: { userName } })
                socket.currentPlayerName = userName
                socketEventsUtils.switchRooms(socket, '', GlobalRoomName)
            } else {
                socketEventsUtils.sendError(socket, ErrorMessages.NameTaken)
            }
        },
        presidentDesignatedNextPresident: (socket, { playerName }) => {
            socketEventsUtils.sendMessage(socket, { content: `The president has designated ${playerName} as the next president for the next turn!` })
            socketEventsUtils.emitSetChooserPlayer(socket, '')
            socketEventsUtils.resumeGame(socket, {
                delay: 4000,
                func: socketObject => phaseSocketEvents.startChancellorChoicePhase(socketObject, playerName),
            })
        },
        superpowerAffiliationPeekPlayer: (socket, { playerName }) => {
            socketEventsUtils.sendMessage(socket, { content: `The president has choosen ${playerName} to be investigated and has now seen their affiliation!` })
            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const selectedPlayerInfo = RoomsManager.getPlayerInfo(socket.currentRoom, playerName)
            if (selectedPlayerInfo.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
                selectedPlayerInfo.affiliation = PlayerAffilications.FACIST_AFFILIATION
            }
            presidentEmit(SocketEvents.SuperpowerAffiliationPeekAffiliationReveal, {
                data: {
                    playerInfo: selectedPlayerInfo,
                },
            })
        },
        endPeekPlayerSuperpower: (socket) => {
            socketEventsUtils.emitSetChooserPlayer(socket, '')
            socketEventsUtils.resumeGame(socket, { delay: 4000, func: phaseSocketEvents.startChancellorChoicePhase })
        },
        endPeekCardsPhase: (socket) => {
            socketEventsUtils.sendMessage(socket, { content: 'The president has seen the top 3 policy cards' })
            socketEventsUtils.emitSetChooserPlayer(socket, '')
            socketEventsUtils.resumeGame(socket, { delay: 4000, func: phaseSocketEvents.startChancellorChoicePhase })
        },
    }

    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''

        const clientVerificationHof = ClientVerificationHof(RoomsManager)
        const phaseSocketEventsCopy = cloneDeep(phaseSocketEvents)
        phaseSocketEventsCopy.startGame = clientVerificationHof(['isOwner'], phaseSocketEventsCopy.startGame)
        phaseSocketEventsCopy.endGame = clientVerificationHof(['isOwner'], phaseSocketEventsCopy.endGame)
        socketEvents.kickPlayer = clientVerificationHof(['isOwner'], socketEvents.kickPlayer)
        socketEvents.superpowerAffiliationPeekPlayer = clientVerificationHof(['isPresident'], socketEvents.superpowerAffiliationPeekPlayer)
        socketEvents.endPeekPlayerSuperpower = clientVerificationHof(['isPresident'], socketEvents.endPeekPlayerSuperpower)
        socketEvents.endPeekCardsPhase = clientVerificationHof(['isPresident'], socketEvents.endPeekCardsPhase)

        // to avoid creating new binded functions each time an action is made. This is made only once.
        // we need a way to pass socket object into those functions
        const partialFunctions = mapValues({
            ...socketEvents,
            ...phaseSocketEventsCopy,
            sendMessage: socketEventsUtils.sendMessage,
        }, func => partial(func, socket))
        partialFunctions['banPlayer'] = partialRight(partialFunctions.kickPlayer, true)

        socket.on('disconnect', partialFunctions.disconnect)
        socket.on(SocketEvents.CLIENT_CREATE_ROOM, partialFunctions.createRoom)
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, partialFunctions.sendMessage)
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, partialFunctions.joinRoom)
        socket.on(SocketEvents.VOTING_PHASE_START, partialFunctions.startVotingPhaseVote)
        socket.on(SocketEvents.CLIENT_VOTE, partialFunctions.vote)
        socket.on(SocketEvents.START_GAME, partialFunctions.startGame)
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, partialFunctions.startChancellorChoicePhase)
        socket.on(SocketEvents.PlayerKilled, partialFunctions.killPlayer)
        socket.on(SocketEvents.PlayerBanned, partialFunctions.banPlayer)
        socket.on(SocketEvents.PlayerKicked, partialFunctions.kickPlayer)
        socket.on(SocketEvents.ChoosePolicy, partialFunctions.choosePolicy)
        socket.on(SocketEvents.SelectName, partialFunctions.selectName)
        socket.on(SocketEvents.VetoVoteRegistered, partialFunctions.veto)
        socket.on(SocketEvents.DesignateNextPresident, partialFunctions.presidentDesignatedNextPresident)
        socket.on(SocketEvents.SuperpowerAffiliationPeekPlayerChoose, partialFunctions.superpowerAffiliationPeekPlayer)
        socket.on(SocketEvents.SuperpowerAffiliationPeekAffiliationReveal, partialFunctions.endPeekPlayerSuperpower)
        socket.on(SocketEvents.PeekCards, partialFunctions.endPeekCardsPhase)
        socket.on(SocketEvents.GameFinished, partialFunctions.endGame)
    })
}
