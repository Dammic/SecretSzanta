const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp
const { SocketEvents } = require('../Dictionary')
const { forEach } = require('lodash')

module.exports = function(io, RoomsManager) {
    const disconnect = (socket) => {
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
    }

    const createRoom = (socket, { roomName, maxPlayers, password }) => {
        // if the room does not exist, create it
        if (roomName && !RoomsManager.isRoomPresent(roomName)) {
            RoomsManager.initializeRoom(roomName, maxPlayers, password)
        } else {
            console.error('selected room is already present! Cannot create a duplicate!')
        }
    }

    const sendMessage = (socket, { content, author }) => {
        io.sockets.in(socket.currentRoom).emit(SocketEvents.CLIENT_SEND_MESSAGE, {
            data: {
                timestamp: getCurrentTimestamp(),
                author,
                content,
            },
        })
    }

    const joinRoom = (socket, { playerName, roomName }) => {
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
            socket.emit(SocketEvents.CLIENT_JOIN_ROOM, {
                error: 'Error - WHY IS THE ROOM GONE?!',
            })
        }
    }

    const startGame = (socket) => {
        const facists = RoomsManager.getFacists(socket.currentRoom)

        RoomsManager.startGame(socket.currentRoom)
        forEach(facists, (player) => {
            player.emit(SocketEvents.BECOME_FACIST, {
                data: {
                    facists,
                },
            })
        })
        io.sockets.in(socket.currentRoom).emit(SocketEvents.START_GAME)
    }

    const startVotingPhaseVote = (socket, { chancellorName }) => {
        RoomsManager.initializeVoting(socket.currentRoom, chancellorName)
        io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_START, {
            data: {
                chancellorCandidate: chancellorName,
            },
        })
    }

    const startChancellorChoicePhase = (socket) => {
        RoomsManager.startChancellorChoicePhase(socket.currentRoom)
        const playersChoices = RoomsManager.getChancellorChoices(socket.currentRoom)

        io.sockets.in(socket.currentRoom).emit(SocketEvents.CHANCELLOR_CHOICE_PHASE, {
            data: {
                playersChoices,
                presidentName: RoomsManager.getPresident(socket.currentRoom).playerName,
            },
        })
    }

    const vote = (socket, { value }) => {
        RoomsManager.vote(socket.currentRoom, socket.currentPlayerName, value)
        if (RoomsManager.didAllVote(socket.currentRoom)) {
            const votingResult = RoomsManager.getVotingResult(socket.currentRoom)
            if (votingResult) {
                RoomsManager.setChancellor(socket.currentRoom)
            } else {
                setTimeout(() => {
                    startChancellorChoicePhase(socket)
                }, 3000)
            }
            io.sockets.in(socket.currentRoom).emit(SocketEvents.VOTING_PHASE_REVEAL, {
                data: {
                    votes: RoomsManager.getVotes(socket.currentRoom),
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
                },
            })
        }
    }

    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''

        // to avoid creating new binded functions each time an action is made. This is made only once.
        // we need a way to pass socket object into those functions and we do it by passing it as *this*
        const bindedFunctions = {
            disconnect: disconnect.bind(null, socket),
            createRoom: createRoom.bind(null, socket),
            sendMessage: sendMessage.bind(null, socket),
            joinRoom: joinRoom.bind(null, socket),
            startVotingPhaseVote: startVotingPhaseVote.bind(null, socket),
            vote: vote.bind(null, socket),
            startGame: startGame.bind(null, socket),
            startChancellorChoicePhase: startChancellorChoicePhase.bind(null, socket),
        }

        socket.on('disconnect', bindedFunctions.disconnect)
        socket.on(SocketEvents.CLIENT_CREATE_ROOM, bindedFunctions.createRoom)
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, bindedFunctions.sendMessage)
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, bindedFunctions.joinRoom)
        socket.on(SocketEvents.VOTING_PHASE_START, bindedFunctions.startVotingPhaseVote)
        socket.on(SocketEvents.CLIENT_VOTE, bindedFunctions.vote)
        socket.on(SocketEvents.START_GAME, bindedFunctions.startGame)
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, bindedFunctions.startChancellorChoicePhase)
    })
}
