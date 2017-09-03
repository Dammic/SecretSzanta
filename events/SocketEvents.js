const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp
const { SocketEvents } = require('../Dictionary')
const { forEach, mapValues, partial } = require('lodash')

module.exports = function (io, RoomsManager) {
    const socketEvents = {
        disconnect: (socket) => {
            if (socket.currentRoom && RoomsManager.isRoomPresent(socket.currentRoom)) {
                RoomsManager.removePlayer(socket.currentRoom, socket.currentPlayerName)
                io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_LEAVE_ROOM, {
                    data: {
                        timestamp: getCurrentTimestamp(),
                        playerName: socket.currentPlayerName,
                    },
                })
                socket.currentRoom = ''
            }
            socket.currentPlayerName = ''
        },

        createRoom: (socket, { roomName, maxPlayers, password }) => {
            // if the room does not exist, create it
            if (roomName && !RoomsManager.isRoomPresent(roomName)) {
                RoomsManager.initializeRoom(roomName, maxPlayers, password)
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
                console.error('Why is the room gone!')
                socket.emit(SocketEvents.CLIENT_ERROR, {
                    error: 'Error - WHY IS THE ROOM GONE?!',
                })
            }
        },

        startGame: (socket) => {
            const facists = RoomsManager.getFacists(socket.currentRoom)

            RoomsManager.startGame(socket.currentRoom)
            forEach(facists, (player) => {
                player.emit(SocketEvents.BECOME_FACIST, {
                    data: {
                        facists,
                    },
                })
            })
            io.sockets.in(socket.currentRoom).emit(SocketEvents.START_GAME, {
                data: {
                    playerName: socket.currentPlayerName,
                    timestamp: getCurrentTimestamp(),
                },
            })
        },

        startVotingPhaseVote: (socket, { chancellorName }) => {
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
            if (RoomsManager.didAllVote(socket.currentRoom)) {
                const votingResult = RoomsManager.getVotingResult(socket.currentRoom)
                if (votingResult) {
                    RoomsManager.setChancellor(socket.currentRoom)
                } else {
                    setTimeout(() => {
                        socketEvents.startChancellorChoicePhase(socket)
                    }, 3000)
                }
                io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_REVEAL, {
                    data: {
                        votes: RoomsManager.getVotes(socket.currentRoom),
                        timestamp: getCurrentTimestamp(),
                        newChancellor: (votingResult
                            ? RoomsManager.getChancellor(socket.currentRoom).playerName
                            : null
                        ),
                    },
                })
            } else {
                io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_NEWVOTE, {
                    data: {
                        playerName: socket.currentPlayerName,
                        remaining: RoomsManager.getRemainingVotesCount(socket.currentRoom),
                        timestamp: getCurrentTimestamp(),
                    },
                })
            }
        },
    }

    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''

        // to avoid creating new binded functions each time an action is made. This is made only once.
        // we need a way to pass socket object into those functions
        const partialFunctions = mapValues(socketEvents, func => partial(func, socket))

        socket.on('disconnect', partialFunctions.disconnect)
        socket.on(SocketEvents.CLIENT_CREATE_ROOM, partialFunctions.createRoom)
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, partialFunctions.sendMessage)
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, partialFunctions.joinRoom)
        socket.on(SocketEvents.VOTING_PHASE_START, partialFunctions.startVotingPhaseVote)
        socket.on(SocketEvents.CLIENT_VOTE, partialFunctions.vote)
        socket.on(SocketEvents.START_GAME, partialFunctions.startGame)
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, partialFunctions.startChancellorChoicePhase)
    })
}
