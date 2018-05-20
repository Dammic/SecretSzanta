import {
    getCurrentTimestamp,
    logInfo,
    logError,
} from '../utils/utils'
import {
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
} from '../Dictionary'
import lodash from 'lodash'
import ClientVerificationHof from '../utils/ClientVerificationHof'
import SocketEventsUtils from '../utils/SocketEventsUtils'
import PhaseSocketEvents from './PhaseSocketEvents'
import EnactPolicyModule from './enactPolicy'
import {
    setGamePhase,
    clearVetoVotes,
    getRoleSocket,
    getGamePhase,
    getVetoVotes,
    getPlayerRole,
    addVetoVote,
    didVetoSucceed,
    discardPolicyByVeto,
    getPolicyCardsCount,
    isRoomPresent,
    getRoomOwner,
    removePlayer,
    findNewRoomOwner,
    getRoomDetails,
    getPlayersCount,
    getFacists,
    removeRoom,
    removePlayerFromPlayersList,
    initializeRoom,
    getRoomDetailsForLobby,
    isInBlackList,
    addPlayer,
    getPlayerInfo,
    vote,
    getRemainingVotesCount,
    didAllVote,
    getVotingResult,
    setChancellor,
    getVotes,
    getChancellor,
    getDrawnCards,
    getPresident,
    discardPolicy,
    killPlayer,
    getHitler,
    kickPlayer,
    discardAllCards,
    chooseNextPresident,
    initializeVoting,
    isInPlayersList,
    addPlayerToPlayersList,
    isVetoUnlocked,
} from '../utils/RoomsManager'

const { isNil, includes, find, map, pick, get, mapValues, partial, partialRight, cloneDeep } = lodash


export default function (io) {
    const phaseSocketEvents = PhaseSocketEvents(io)
    const socketEventsUtils = SocketEventsUtils(io)
    const {
        enactPolicyEvent, checkForImmediateSuperpowersOrContinue,
        updateTrackerPositionIfNecessary,
    } = EnactPolicyModule(io, phaseSocketEvents, socketEventsUtils)
    const socketEvents = {
        triggerVetoPrompt: (socket) => {
            setGamePhase(socket.currentRoom, GamePhases.ServerWaitingForVeto)
            clearVetoVotes(socket.currentRoom)

            const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const chancellorEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
            presidentEmit(SocketEvents.ServerWaitingForVeto)
            chancellorEmit(SocketEvents.ServerWaitingForVeto)
            const onGameResume = (socket) => {
                const shouldGameFinish = phaseSocketEvents.checkIfGameShouldFinish(socket)
                if (!shouldGameFinish) {
                    phaseSocketEvents.startChancellorChoicePhase(socket);
                }
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
            const gamePhase = getGamePhase(socket.currentRoom)
            if (gamePhase !== GamePhases.ServerWaitingForVeto) {
                logError(socket, 'Player tried to veto when the server was not waiting for it!')
                socketEventsUtils.sendError(socket, 'You cannot veto right now!')
                return
            }
            const vetoVotes = getVetoVotes(socket.currentRoom)
            const playerRole = getPlayerRole(socket.currentRoom, socket.currentPlayerName)
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
            addVetoVote(socket.currentRoom, socket.currentPlayerName)

            const roleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'president' : 'chancellor'
            if (didVetoSucceed(socket.currentRoom)) {
                setGamePhase(socket.currentRoom, GamePhases.ServerAcceptedVeto)
                socketEventsUtils.sendMessage(socket, { content: `The ${roleString} invoked veto for the enacted policy as well! The enacted policy has been rejected!` })
                socketEventsUtils.clearNextPhaseTimeout()
                discardPolicyByVeto(socket.currentRoom)
                updateTrackerPositionIfNecessary(socket, false)

                const shouldGameFinish = phaseSocketEvents.checkIfGameShouldFinish(socket)
                if (!shouldGameFinish) {
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.SyncPolicies, {
                        data: {
                            facist: getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy),
                            liberal: getPolicyCardsCount(socket.currentRoom, PolicyCards.LiberalPolicy),
                        },
                    })

                    socketEventsUtils.resumeGame(socket, { delay: 5000, func: phaseSocketEvents.startChancellorChoicePhase })
                }
            } else {
                const missingVetoRoleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'chancellor' : 'president'
                socketEventsUtils.sendMessage(socket, { content: `The ${roleString} invoked veto for the enacted policy! Will the ${missingVetoRoleString} call veto as well?` })
            }
        },

        disconnect: (socket) => {
            if (socket.currentRoom && isRoomPresent(socket.currentRoom)) {
                const roomOwnerName = getRoomOwner(socket.currentRoom).playerName

                removePlayer(socket.currentRoom, socket.currentPlayerName)
                io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_LEAVE_ROOM, {
                    data: {
                        timestamp: getCurrentTimestamp(),
                        playerName: socket.currentPlayerName,
                    },
                })

                if (socket.currentPlayerName === roomOwnerName) {
                    const newOwner = findNewRoomOwner(socket.currentRoom)
                    if (!isNil(newOwner)) {
                        const roomDetails = getRoomDetails(socket.currentRoom)
                        newOwner.emit(SocketEvents.CLIENT_GET_ROOM_DATA, { data: roomDetails })

                        if (newOwner.affiliation === PlayerAffilications.FACIST_AFFILIATION
                            || newOwner.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
                            const playersCount = getPlayersCount(socket.currentRoom)
                            const fascists = getFacists(socket.currentRoom)
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
                        removeRoom(socket.currentRoom)
                        logInfo(socket, 'The room was permanently removed!')
                    }
                }
            }

            removePlayerFromPlayersList(socket.currentPlayerName)
            socketEventsUtils.switchRooms(socket, socket.currentRoom, '')
            socket.currentPlayerName = ''
        },

        createRoom: (socket, { roomName, maxPlayers, password }) => {
            // if the room does not exist, create it
            if (roomName && !isRoomPresent(roomName)) {
                initializeRoom(roomName, socket.currentPlayerName, maxPlayers, password)

                io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                    data: {
                        roomName,
                        room: getRoomDetailsForLobby(roomName),
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
            if (!roomName || socket.currentRoom !== GlobalRoomName || !isRoomPresent(roomName)) {
                logError(socket, 'Player tried to enter nonexistent room!')
                socketEventsUtils.sendError(socket, 'The room does not exist!')
                return
            }

            if (isInBlackList(roomName, socket.currentPlayerName)) {
                logInfo(socket, 'Banned player tried to enter the room!')
                socketEventsUtils.sendError(socket, 'You are BANNED in this room by the owner!')
                return
            }

            const addingError = addPlayer(roomName, socket.currentPlayerName, socket)

            if (addingError !== undefined) {
                socketEventsUtils.sendError(socket, ErrorMappedMessages[addingError])
                return
            }

            socketEventsUtils.switchRooms(socket, socket.currentRoom, roomName)

            const roomDetails = getRoomDetails(roomName)

            socket.emit(SocketEvents.AllowEnteringRoom, { data: { roomName: socket.currentRoom } })
            socket.emit(SocketEvents.CLIENT_GET_ROOM_DATA, { data: roomDetails })

            io.sockets.in(roomName).emit(SocketEvents.CLIENT_JOIN_ROOM, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    player: getPlayerInfo(roomName, socket.currentPlayerName),
                },
            })
        },

        vote: (socket, { value }) => {
            vote(socket.currentRoom, socket.currentPlayerName, value)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_NEWVOTE, {
                data: {
                    playerName: socket.currentPlayerName,
                    remaining: getRemainingVotesCount(socket.currentRoom),
                    timestamp: getCurrentTimestamp(),
                },
            })
            if (didAllVote(socket.currentRoom)) {
                const hasVotingSucceed = getVotingResult(socket.currentRoom)
                const votingResultMessage = `Voting completed! ${hasVotingSucceed
                    ? `${socket.currentPlayerName} has become the new chancellor!`
                    : 'The proposal has been rejected!'}
                `
                socketEventsUtils.sendMessage(socket, { content: votingResultMessage })

                updateTrackerPositionIfNecessary(socket, hasVotingSucceed)

                if (hasVotingSucceed) {
                    setChancellor(socket.currentRoom)
                }

                const shouldGameFinish = phaseSocketEvents.checkIfGameShouldFinish(socket)
                if (!shouldGameFinish) {
                    socketEventsUtils.resumeGame(socket, { delay: 3000, func: hasVotingSucceed ? phaseSocketEvents.startPresidentPolicyChoice : phaseSocketEvents.startChancellorChoicePhase })
                }

                io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_REVEAL, {
                    data: {
                        votes: getVotes(socket.currentRoom),
                        timestamp: getCurrentTimestamp(),
                        newChancellor: (hasVotingSucceed
                            ? getChancellor(socket.currentRoom).playerName
                            : null
                        ),
                    },
                })
            }
        },

        choosePolicy: (socket, { choice }) => {
            const { gamePhase } = getRoomDetails(socket.currentRoom)
            let drawnCards = getDrawnCards(socket.currentRoom)
            if (includes(drawnCards, choice)) {
                const president = getPresident(socket.currentRoom)
                const chancellor = getChancellor(socket.currentRoom)
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
            enactPolicyEvent(socket, choice)

            const isVeto = isVetoUnlocked(socket.currentRoom)
            if (isVeto) {
                socketEvents.triggerVetoPrompt(socket)
            } else {
                const shouldGameFinish = phaseSocketEvents.checkIfGameShouldFinish(socket)
                if (!shouldGameFinish) {
                    socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
                }
            }
        },

        choosePolicyPresident: (socket, choice, drawnCards, chancellorName) => {
            setGamePhase(socket.currentRoom, GamePhases.ChancellorPolicyChoice)
            const chancellorEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.ChancellorChoosePolicy, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    chancellorName,
                },
            })
            discardPolicy(socket.currentRoom, choice)
            chancellorEmit(SocketEvents.ChoosePolicy, {
                data: {
                    policyCards: drawnCards,
                    title: 'Choose policy to enact',
                },
            })
        },

        killPlayer: (socket, { playerName }) => {
            killPlayer(socket.currentRoom, playerName)
            const hitler = getHitler(socket.currentRoom)
            const wasHitler = hitler.playerName === playerName
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PlayerKilled, {
                data: {
                    wasHitler,
                    playerName,
                    timestamp: getCurrentTimestamp(),
                },
            })

            const shouldGameFinish = phaseSocketEvents.checkIfGameShouldFinish(socket)
            if (shouldGameFinish) {
                return
            }

            socketEventsUtils.resumeGame(socket, { delay: 4000, func: phaseSocketEvents.startChancellorChoicePhase })
        },
        kickPlayer: (socket, { playerName }, permanently = false) => {
            const hasGameBegan = getGamePhase(socket.currentRoom) !== GamePhases.GAME_PHASE_NEW
            const isOverlaysHidingNeeded = hasGameBegan && (
                socketEvents.kickIfHitler(socket, playerName)
                || socketEvents.kickIfPresident(socket, playerName)
            )

            kickPlayer(socket.currentRoom, playerName, permanently)
            socketEventsUtils.clearNextPhaseTimeout()

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
            const presidentName = get(getPresident(socket.currentRoom), 'playerName')
            if (playerName !== presidentName) return false;

            discardAllCards(socket.currentRoom)
            chooseNextPresident(socket.currentRoom)
            initializeVoting(socket.currentRoom) // resets chancellor player name
            setChancellor(socket.currentRoom)
            socketEventsUtils.resumeGame(socket, { delay: 1000, func: phaseSocketEvents.startChancellorChoicePhase })
            return true
        },
        kickIfHitler: (socket, playerName) => {
            const hitlerName = get(getHitler(socket.currentRoom), 'playerName')
            return playerName === hitlerName
        },
        selectName: (socket, { userName }) => {
            // deselecting name
            if (!userName) {
                removePlayerFromPlayersList(socket.currentPlayerName)
                socketEventsUtils.switchRooms(socket, GlobalRoomName, '')
                socket.emit(SocketEvents.SelectName, { data: { userName: '' } })
                socket.currentPlayerName = ''
            // selecting name
            } else if (!isInPlayersList(userName)) {
                addPlayerToPlayersList(userName)
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
            const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const selectedPlayerInfo = getPlayerInfo(socket.currentRoom, playerName)
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

        const clientVerificationHof = ClientVerificationHof()
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
