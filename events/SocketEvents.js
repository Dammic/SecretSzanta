const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp
const { SocketEvents, GamePhases, PlayerAffilications, ErrorMessages, PlayerRole, PolicyCards, GlobalRoomName } = require('../Dictionary')
const { isNil, includes, find, map, pick, get, forEach, mapValues, partial, partialRight } = require('lodash')
const ClientVerificationHof = require('../utils/ClientVerificationHof')
const RoomsManager = new (require('../utils/RoomsManager'))()
let cancelTimeoutToken

module.exports = function (io) {
    const facistSubproperties = ['playerName', 'affiliation', 'facistAvatar']
    const socketEvents = {
        sendError: (socket, errorMessage) => {
            socket.emit(SocketEvents.CLIENT_ERROR, { error: errorMessage })
        },

        sendBecomeFascist: (player, playerCount, passedFacists) => {
            const shouldHideOtherFacists = player.affiliation === PlayerAffilications.HITLER_AFFILIATION && playerCount > 6
            player.emit(SocketEvents.BECOME_FACIST, {
                data: {
                    facists: (shouldHideOtherFacists
                        ? pick(player, facistSubproperties)
                        : passedFacists
                    ),
                },
            })
        },
        checkForImmediateSuperpowersOrContinue: (socket) => {
            const fascistPolicyCount = RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)

            // 4th power is always kill on each board
            if (fascistPolicyCount === 4 || fascistPolicyCount === 5) {
                socketEvents.startKillPhase(socket)
            // 5th power is always kill AND veto power unlock
            } else if (fascistPolicyCount === 5) {
                RoomsManager.toggleVeto(socket.currentRoom)
                socketEvents.sendMessage(socket, { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' })
                socketEvents.resumeGame(socket, { delay: 3000, func: socketEvents.startChancellorChoicePhase })
            } else {
                socketEvents.resumeGame(socket, { delay: 3000, func: socketEvents.startChancellorChoicePhase })
            }
        },
        triggerVetoPrompt: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.ServerWaitingForVeto)
            RoomsManager.clearVetoVotes(socket.currentRoom)

            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
            const chancellorEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
            presidentEmit(SocketEvents.ServerWaitingForVeto)
            chancellorEmit(SocketEvents.ServerWaitingForVeto)
            socketEvents.resumeGame(
                socket,
                {
                    delay: 30000,
                    func: socketEvents.startChancellorChoicePhase,
                    customMessage: 'Due to veto power, the president and chancellor can now together veto the enacted policy. Next phase will begin in 30 seconds (assuming no veto will be reported)...',
                },
            )
        },
       
        // protect it that it can only be fired by president OR chancellor ONCE
        veto: (socket) => {
            const gamePhase = RoomsManager.getGamePhase(socket.currentRoom)
            if (gamePhase !== GamePhases.ServerWaitingForVeto) {
                console.error('Player tried to veto when the server was not waiting for it!')
                socket.emit(SocketEvents.CLIENT_ERROR, {
                    error: 'You cannot veto right now!',
                })
            }
            const vetoVotes = RoomsManager.getVetoVotes(socket.currentRoom)
            const playerRole = RoomsManager.getPlayerRole(socket.currentRoom, socket.currentPlayerName)
            if (includes(vetoVotes, playerRole)) {
                console.error('Player tried to vote twice!')
                socket.emit(SocketEvents.CLIENT_ERROR, {
                    error: 'You cannot veto twice!',
                })
            }

            RoomsManager.addVetoVote(socket.currentRoom, socket.currentPlayerName)
            const roleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'president' : 'chancellor'
            if (RoomsManager.didVetoSucceed(socket.currentRoom)) {
                RoomsManager.setGamePhase(socket.currentRoom, GamePhases.ServerAcceptedVeto)
                socketEvents.sendMessage(socket, { content: `The ${roleString} invoked veto for the enacted policy as well! The enacted policy has been rejected!` })
                clearTimeout(cancelTimeoutToken)
                RoomsManager.discardPolicyByVeto(socket.currentRoom)
                socketEvents.checkIfTrackerPositionShouldUpdate(socket, false)

                io.sockets.in(socket.currentRoom).emit(SocketEvents.SyncPolicies, {
                    data: {
                        facist: RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy),
                        liberal: RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.LiberalPolicy),
                    },
                })
                
                socketEvents.resumeGame(socket, { delay: 5000, func: socketEvents.startChancellorChoicePhase })
            } else {
                const missingVetoRoleString = playerRole === PlayerRole.ROLE_PRESIDENT ? 'chancellor' : 'president'
                socketEvents.sendMessage(socket, { content: `The ${roleString} invoked veto for the enacted policy! Will the ${missingVetoRoleString} call veto as well?` })
            }
        },

        resumeGame: (socket, { delay, func, customMessage }) => {
            const gamePhase = RoomsManager.getGamePhase(socket.currentRoom)
            if (delay) {
                socketEvents.sendMessage(socket, { content: customMessage || `Next phase will begin in ${delay / 1000} seconds!` })
                cancelTimeoutToken = setTimeout(func.bind(null, socket), delay)
            } else {
                func(socket)
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
                            const passedFacists = map(fascists, fascist => pick(fascist, facistSubproperties))
                            socketEvents.sendBecomeFascist(newOwner, playersCount, passedFacists)
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
                        console.log(`The room "${socket.currentRoom}" was permanently removed!`)
                    }
                }
            }

            RoomsManager.removePlayerFromPlayersList(socket.currentPlayerName)
            socketEvents.switchRooms(socket, socket.currentRoom, '')
            socket.currentPlayerName = ''
        },

        createRoom: (socket, { roomName, playerName, maxPlayers, password }) => {
            // if the room does not exist, create it
            if (roomName && !RoomsManager.isRoomPresent(roomName)) {
                RoomsManager.initializeRoom(roomName, playerName, maxPlayers, password)

                io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                    data: {
                        roomName,
                        room: RoomsManager.getRoomDetailsForLobby(roomName),
                    },
                })
                socketEvents.joinRoom(socket, { roomName, playerName })
            } else {
                console.error('selected room is already present! Cannot create a duplicate!')
                socket.emit(SocketEvents.CLIENT_ERROR, {
                    error: 'You cannot create duplicate of this room!',
                })
            }
        },

        sendMessage: (socket, { content, author }) => {
            io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_SEND_MESSAGE, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    author,
                    content,
                },
            })
        },

        joinRoom: (socket, { playerName, roomName }) => {
            if (roomName && socket.currentRoom === GlobalRoomName && RoomsManager.isRoomPresent(roomName)) {
                if (RoomsManager.isInBlackList(roomName, playerName)) {
                    console.log(`INFO - Banned player ${playerName} tried to enter room ${roomName}!`)
                    socket.emit(SocketEvents.CLIENT_ERROR, {
                        error: 'You are BANNED in this room by the owner!',
                    })
                    return
                }

                RoomsManager.addPlayer(roomName, playerName, socket)
                socketEvents.switchRooms(socket, socket.currentRoom, roomName)

                const roomDetails = RoomsManager.getRoomDetails(roomName)

                socket.emit(SocketEvents.AllowEnteringRoom, { data: { roomName: socket.currentRoom } })
                socket.emit(SocketEvents.CLIENT_GET_ROOM_DATA, { data: roomDetails })

                io.sockets.in(roomName).emit(SocketEvents.CLIENT_JOIN_ROOM, {
                    data: {
                        timestamp: getCurrentTimestamp(),
                        player: RoomsManager.getPlayerInfo(roomName, playerName),
                    },
                })
            } else {
                console.error(`ERROR - Why is the room gone!, Player ${playerName} tried to enter nonexistent room ${roomName}!`)
                socket.emit(SocketEvents.CLIENT_ERROR, {
                    error: 'Error - WHY IS THE ROOM GONE?!',
                })
            }
        },

        startGame: (socket) => {
            RoomsManager.startGame(socket.currentRoom)
            const facists = RoomsManager.getFacists(socket.currentRoom)

            // just filtering out emit functions
            const passedFacists = map(facists, facist => pick(facist, facistSubproperties))
            const playerCount = RoomsManager.getPlayersCount(socket.currentRoom)

            forEach(facists, player => socketEvents.sendBecomeFascist(player, playerCount, passedFacists))
            io.sockets.in(socket.currentRoom).emit(SocketEvents.START_GAME, {
                data: {
                    playerName: socket.currentPlayerName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startVotingPhaseVote: (socket, { playerName: chancellorName }) => {
            RoomsManager.initializeVoting(socket.currentRoom, chancellorName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_START, {
                data: {
                    chancellorCandidate: chancellorName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startChancellorChoicePhase: (socket) => {
            RoomsManager.startChancellorChoicePhase(socket.currentRoom)
            const playersChoices = RoomsManager.getChancellorChoices(socket.currentRoom)

            io.sockets.in(socket.currentRoom).emit(SocketEvents.CHANCELLOR_CHOICE_PHASE, {
                data: {
                    playersChoices,
                    presidentName: RoomsManager.getPresident(socket.currentRoom).playerName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        enactPolicy: (socket, policy) => {
            const isFacist = policy === PolicyCards.FacistPolicy
            RoomsManager.enactPolicy(socket.currentRoom, policy)
            socketEvents.sendMessage(socket, { content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
            io.sockets.in(socket.currentRoom).emit(SocketEvents.NewPolicy, {
                data: {
                    policy,
                },
            })
        },

        resetElectionTracker: (socket, positionBeforeReset) => {
            if (positionBeforeReset) {
                io.sockets.in(socket.currentRoom).emit(SocketEvents.ResetTracker, {
                    data: {
                        timestamp: getCurrentTimestamp(),
                        trackerPositionBeforeReset: positionBeforeReset,
                    },
                })
                RoomsManager.resetFailedElectionsCount(socket.currentRoom)
                const trackerMessage = `The failed elections tracker${positionBeforeReset === 3 ? ' has reached 3, so it' : ''} will be reset!`
                socketEvents.sendMessage(socket, { content: trackerMessage })
            }
        },

        checkIfTrackerPositionShouldUpdate: (socket, isSuccess) => {
            if (isSuccess) {
                const trackerPosition = RoomsManager.getFailedElectionsCount(socket.currentRoom)
                socketEvents.resetElectionTracker(socket, trackerPosition)
            } else {
                RoomsManager.increaseFailedElectionsCount(socket.currentRoom)
                socketEvents.sendMessage(socket, { content: 'The failed elections tracker has increased!' })
                const failedElectionsCount = RoomsManager.getFailedElectionsCount(socket.currentRoom)
                if (failedElectionsCount >= 3) {
                    socketEvents.resetElectionTracker(socket, failedElectionsCount)

                    const topCard = RoomsManager.takeChoicePolicyCards(socket.currentRoom, 1)
                    socketEvents.enactPolicy(socket, topCard)
                } else {
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.IncreaseTrackerPosition, {
                        data: {
                            timestamp: getCurrentTimestamp(),
                        },
                    })
                }
            }
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
                    ? `${socket.currentRoom} has become the new chancellor!`
                    : 'The proposal has been rejected!'}
                `
                socketEvents.sendMessage(socket, { content: votingResultMessage })

                socketEvents.checkIfTrackerPositionShouldUpdate(socket, hasVotingSucceed)

                if (hasVotingSucceed) {
                    RoomsManager.setChancellor(socket.currentRoom)
                    socketEvents.resumeGame(socket, { delay: 3000, func: socketEvents.startPresidentPolicyChoice })
                } else {
                    socketEvents.resumeGame(socket, { delay: 3000, func: socketEvents.startChancellorChoicePhase })
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
        startPresidentPolicyChoice: (socket) => {
            const presidentEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)

            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.PresidentPolicyChoice)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PresidentChoosePolicy, {
                data: {
                    timestamp: getCurrentTimestamp(),
                    presidentName: RoomsManager.getPresident(socket.currentRoom).playerName,
                },
            })
            presidentEmit(SocketEvents.ChoosePolicy, {
                data: {
                    policyCards: RoomsManager.takeChoicePolicyCards(socket.currentRoom, 3),
                    title: 'Discard one policy and pass the rest to the chancellor',
                    role: PlayerRole.ROLE_PRESIDENT,
                },
            })
        },

        choosePolicy: (socket, { choice }) => {
            const { gamePhase } = RoomsManager.getRoomDetails(socket.currentRoom)
            let drawnCards = RoomsManager.getDrawnCards(socket.currentRoom)
            if (includes(drawnCards, choice)) {
                const president = RoomsManager.getPresident(socket.currentRoom)
                const chancellor = RoomsManager.getChancellor(socket.currentRoom)
                if (gamePhase === GamePhases.PresidentPolicyChoice && president.playerName === socket.currentPlayerName) {
                    RoomsManager.setGamePhase(socket.currentRoom, GamePhases.ChancellorPolicyChoice)
                    const chancellorEmit = RoomsManager.getRoleSocket(socket.currentRoom, PlayerRole.ROLE_CHANCELLOR)
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.ChancellorChoosePolicy, {
                        data: {
                            timestamp: getCurrentTimestamp(),
                            chancellorName: chancellor.playerName,
                        },
                    })
                    RoomsManager.discardPolicy(socket.currentRoom, choice)
                    chancellorEmit(SocketEvents.ChoosePolicy, {
                        data: {
                            policyCards: drawnCards,
                            title: 'Choose policy to enact',
                            role: PlayerRole.ROLE_CHANCELLOR,
                        },
                    })
                } else if (gamePhase === GamePhases.ChancellorPolicyChoice && chancellor.playerName === socket.currentPlayerName) {
                    RoomsManager.discardPolicy(socket.currentRoom, choice)
                    const enactedPolicy = drawnCards[0]

                    socketEvents.enactPolicy(socket, enactedPolicy)

                    const isVetoUnlocked = RoomsManager.isVetoUnlocked(socket.currentRoom)
                    if (isVetoUnlocked) {
                        socketEvents.triggerVetoPrompt(socket) 
                    } else if (enactedPolicy === PolicyCards.FacistPolicy) {
                        socketEvents.checkForImmediateSuperpowersOrContinue(socket)
                    } else {
                        socketEvents.resumeGame(socket, { delay: 3000, func: socketEvents.startChancellorChoicePhase })
                    }
                } else {
                    console.error('Cheater!')
                    // cheating (bad role tried to choose)? 
                }
            } else {
                console.error('Cheater!')
                // cheating (sent card was not in collection)! 
            }
        },

        startKillPhase: (socket) => {
            RoomsManager.setGamePhase(socket.currentRoom, GamePhases.GAME_PHASE_SUPERPOWER)
            const presidentName = get(RoomsManager.getPresident(socket.currentRoom), 'playerName')
            const playersChoices = RoomsManager.getOtherAlivePlayers(socket.currentRoom, presidentName)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.KillSuperpowerUsed, {
                data: {
                    presidentName,
                    timestamp: getCurrentTimestamp(),
                    playersChoices,
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
            if (wasHitler) {
                const facists = RoomsManager.getFacists(socket.currentRoom)

                const passedFacists = map(facists, facist => pick(facist, ['playerName', 'affiliation', 'facistAvatar']))
                io.sockets.in(socket.currentRoom).emit(SocketEvents.GameFinished, {
                    data: {
                        whoWon: PlayerAffilications.LIBERAL_AFFILIATION,
                        facists: passedFacists,
                    },
                })
            } else {
                socketEvents.resumeGame(socket, { delay: 4000, func: socketEvents.startChancellorChoicePhase })
            }
        },
        kickPlayer: (socket, { playerName }, permanently = false) => {
            RoomsManager.kickPlayer(socket.currentRoom, playerName, permanently)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PlayerKicked, {
                data: {
                    playerName,
                    timestamp: getCurrentTimestamp(),
                    wasBanned: permanently,
                },
            })
            const kickedSocket = find(io.sockets.in(socket.currentRoom).sockets, { currentPlayerName: playerName })
            socketEvents.switchRooms(kickedSocket, socket.currentRoom, GlobalRoomName)
        },
        switchRooms: (socket, startRoom, targetRoom) => {
            if (startRoom) {
                socket.leave(startRoom)
                socketEvents.sendMessage(socket, { content: `${socket.currentPlayerName} has left the room` })
                
                const updatedRoom = (startRoom === GlobalRoomName ? targetRoom : startRoom)
                if (updatedRoom) {
                    io.sockets.in(GlobalRoomName).emit(SocketEvents.RoomsListChanged, {
                        data: {
                            roomName: updatedRoom,
                            room: RoomsManager.getRoomDetailsForLobby(updatedRoom),
                        },
                    })
                }
            }
            socket.currentRoom = targetRoom
            if (targetRoom) {
                if (startRoom) {
                    RoomsManager.updatePlayerRoom(socket.currentPlayerName, targetRoom)
                }

                if (targetRoom === GlobalRoomName) {
                    socket.emit(SocketEvents.SyncLobby, {
                        data: {
                            players: RoomsManager.getPlayersList(),
                            rooms: RoomsManager.getRoomsList(),
                        },
                    })
                }
                socket.join(targetRoom)
                socketEvents.sendMessage(socket, { content: `${socket.currentPlayerName} has joined the room` })
            }
            io.sockets.in(GlobalRoomName).emit(SocketEvents.PlayersListChanged, {
                data: {
                    playerName: socket.currentPlayerName,
                    player: RoomsManager.getPlayerFromPlayersList(socket.currentPlayerName),
                },
            })
        },
        selectName: (socket, { userName }) => {
            // deselecting name
            if (!userName) {
                RoomsManager.removePlayerFromPlayersList(socket.currentPlayerName)
                socketEvents.switchRooms(socket, GlobalRoomName, '')
                socket.emit(SocketEvents.SelectName, { data: { userName: '' } })
                socket.currentPlayerName = ''
            // selecting name
            } else if (!RoomsManager.isInPlayersList(userName)) {
                RoomsManager.addPlayerToPlayersList(userName)
                socket.emit(SocketEvents.SelectName, { data: { userName } })
                socket.currentPlayerName = userName
                socketEvents.switchRooms(socket, '', GlobalRoomName)
            } else {
                socketEvents.sendError(socket, ErrorMessages.NameTaken)
            }
        },
    }

    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''

        const clientVerificationHof = ClientVerificationHof(RoomsManager)
        socketEvents.startGame = clientVerificationHof(['isOwner'], socketEvents.startGame)
        socketEvents.kickPlayer = clientVerificationHof(['isOwner'], socketEvents.kickPlayer)

        // to avoid creating new binded functions each time an action is made. This is made only once.
        // we need a way to pass socket object into those functions
        const partialFunctions = mapValues(socketEvents, func => partial(func, socket))
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
        socket.on(SocketEvents.VetoRegistered, partialFunctions.veto)
    })
}
