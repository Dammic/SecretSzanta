const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp
const { SocketEvents, GamePhases, PlayerAffilications, ErrorMessages, PlayerRole, PolicyCards } = require('../Dictionary')
const { pullAt, isNil, indexOf, includes, filter, find, map, pick, get, forEach, mapValues, partial, partialRight } = require('lodash')

module.exports = function (io, RoomsManager) {
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
                        RoomsManager.removeRoom(socket.currentRoom)
                        console.log(`The room "${socket.currentRoom}" was permanently removed!`)
                    }
                }

                socket.leave(socket.currentRoom)
                socket.currentRoom = ''
            }
            socket.currentPlayerName = ''
        },

        createRoom: (socket, { roomName, playerName, maxPlayers, password }) => {
            // if the room does not exist, create it
            if (roomName && !RoomsManager.isRoomPresent(roomName)) {
                RoomsManager.initializeRoom(roomName, playerName, maxPlayers, password)
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
            if (roomName && !socket.currentRoom && RoomsManager.isRoomPresent(roomName)) {
                if (RoomsManager.isInBlackList(roomName, playerName)) {
                    console.log(`INFO - Banned player ${playerName} tried to enter room ${roomName}!`)
                    socket.emit(SocketEvents.CLIENT_ERROR, {
                        error: 'You are BANNED in this room by the owner!',
                    })
                    return
                }

                const roomDetails = RoomsManager.getRoomDetails(roomName)
                socket.join(roomName)
                socket.currentPlayerName = playerName
                socket.currentRoom = roomName

                RoomsManager.addPlayer(roomName, playerName, socket)
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
            if (!RoomsManager.isRoomOwner(socket.currentRoom, socket.currentPlayerName)) {
                socketEvents.sendError(socket, ErrorMessages.notOwner)
                return
            }

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
                let threeVotesFailed = false
                let topCard
                if (hasVotingSucceed) {
                    RoomsManager.setChancellor(socket.currentRoom)
                    setTimeout(() => {
                        socketEvents.startPresidentPolicyChoice(socket)
                    }, 3000)
                } else {
                    threeVotesFailed = RoomsManager.failElection(socket.currentRoom)
                    if (threeVotesFailed) {
                        topCard = RoomsManager.takeChoicePolicyCards(socket.currentRoom, 1)
                        RoomsManager.enactPolicy(socket.currentRoom, topCard)
                    }
                    setTimeout(() => {
                        socketEvents.startChancellorChoicePhase(socket)
                    }, 3000)
                }

                io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_REVEAL, {
                    data: {
                        votes: RoomsManager.getVotes(socket.currentRoom),
                        timestamp: getCurrentTimestamp(),
                        failedElectionsCount: RoomsManager.getFailedElections(socket.currentRoom),
                        newChancellor: (hasVotingSucceed
                            ? RoomsManager.getChancellor(socket.currentRoom).playerName
                            : null
                        ),
                    },
                })
                if (hasVotingSucceed || threeVotesFailed) {
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.ResetTracker, {
                        data: {
                            timestamp: getCurrentTimestamp(),
                        }
                    })
                }
                if (threeVotesFailed) {
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.NewPolicy, {
                        data: {
                            policy: topCard,
                            timestamp: getCurrentTimestamp(),
                        },
                    })
                }
                if (!hasVotingSucceed || threeVotesFailed) {
                    socketEvents.sendMessage(socket, { content: 'Next turn will begin in 3 seconds!' })
                }
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
                    RoomsManager.enactPolicy(socket.currentRoom, enactedPolicy) 
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.NewPolicy, {
                        data: {
                            policy: enactedPolicy,
                            timestamp: getCurrentTimestamp(),
                        },
                    })
                    const fascistPolicyCount = RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)
                    if ((fascistPolicyCount === 4 || fascistPolicyCount === 5) && enactedPolicy === PolicyCards.FacistPolicy) {
                        socketEvents.startKillPhase(socket)
                    } else {
                        setTimeout(() => {
                            socketEvents.startChancellorChoicePhase(socket)
                        }, 4000)
                        socketEvents.sendMessage(socket, { content: 'Next turn will begin in 4 seconds!' })
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
                setTimeout(() => {
                    socketEvents.startChancellorChoicePhase(socket)
                }, 3000)
                socketEvents.sendMessage(socket, { content: 'Next turn will begin in 3 seconds!' })
            }
        },
        kickPlayer: (socket, { playerName }, permanently = false) => {
            if (!RoomsManager.isRoomOwner(socket.currentRoom, socket.currentPlayerName)) {
                socketEvents.sendError(socket, ErrorMessages.notOwner)
                return
            }
            RoomsManager.kickPlayer(socket.currentRoom, playerName, permanently)
            io.sockets.in(socket.currentRoom).emit(SocketEvents.PlayerKicked, {
                data: {
                    playerName,
                    timestamp: getCurrentTimestamp(),
                    wasBanned: permanently,
                },
            })
            const kickedSocket = find(io.sockets.in(socket.currentRoom).sockets, { currentPlayerName: playerName })
            kickedSocket.leave(socket.currentRoom)
        },
    }

    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''

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
    })
}
