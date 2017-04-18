'use strict'
const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp

module.exports = function(io, RoomsManager) {
    const disconnect = function(socket) {
        if(socket.currentRoom) {
            const playerInfo = RoomsManager.getPlayerInfo(socket.currentRoom, socket.currentPlayerName)

            io.sockets.in(socket.currentRoom).emit('CLIENT_LEAVE_ROOM', {
                timestamp: getCurrentTimestamp(),
                playerName: socket.currentPlayerName,
                slotID: playerInfo.slotID
            })
            if(RoomsManager.isRoomPresent(socket.currentRoom)) {
                RoomsManager.removePlayer(socket.currentRoom, socket.currentPlayerName)
            }
            socket.currentRoom = ''
        }

        socket.currentPlayerName = ''
    }

    const createRoom = function(socket, {roomName, maxPlayers, password}) {
        // if the room does not exist, create it
        if(roomName && !RoomsManager.isRoomPresent(roomName)) {
            RoomsManager.initializeRoom(roomName, maxPlayers, password)
        } else {
            //console.error('selected room is already present! Cannot create a duplicate!')
        }
    }

    const sendMessage = function(socket, {content, author}) {
        io.sockets.in(socket.currentRoom).emit('CLIENT_SEND_MESSAGE', {
            timestamp: getCurrentTimestamp(),
            author,
            content
        })
    }

    const joinRoom = function(socket, {playerName, roomName}) {
        if(roomName && socket.currentRoom === '' && RoomsManager.isRoomPresent(roomName)) {
            RoomsManager.addPlayer(roomName, playerName)

            const roomDetails = RoomsManager.getRoomDetails(roomName)

            socket.emit('CLIENT_GET_ROOM_DATA', roomDetails)

            io.sockets.in(roomName).emit('CLIENT_JOIN_ROOM', {
                timestamp: getCurrentTimestamp(),
                playerName,
                playerInfo: RoomsManager.getPlayerInfo(roomName, playerName)
            })

            socket.join(roomName)

            socket.currentPlayerName = playerName
            socket.currentRoom = roomName
        } else {
            socket.emit('CLIENT_JOIN_ROOM', {
                error: 'Error - WHY IS THE ROOM GONE?!'
            })
        }
    }

    const startVotingPhaseVote = function(socket, {chancellorName}) {
        if(chancellorName !== RoomsManager.getChancellor()) {
            RoomsManager.initializeVoting(socket.currentRoom, chancellorName)
            io.sockets.in(socket.currentRoom).emit('VOTING_PHASE_START', {
                chancellorName: chancellorName,
                presidentName: RoomsManager.getPresident()
            })
        } else {
            socket.emit('START_VOTING_PHASE_VOTE', {
                error: 'Error - you cannot choose the previous chancellor as the current one!'
            })
        }
    }

    const vote = function(socket, {value}) {
        RoomsManager.vote(socket.currentRoom, socket.currentPlayerName, value);
        if(RoomsManager.didAllVote(socket.currentRoom)) {
            const votingResult = RoomsManager.getVotingResult(this.currentRoom)
            if(votingResult) {
                RoomsManager.setChancellor(socket.currentRoom)
            }
            setTimeout(() => {
                io.sockets.in(socket.currentRoom).emit('VOTING_PHASE_REVEAL', {
                    votes: RoomsManager.getVotes(this.currentRoom),
                    votingResult
                })
            }, 3000);
        } else {
            io.sockets.in(socket.currentRoom).emit('VOTING_PHASE_NEWVOTE', {
                playerName: socket.currentPlayerName
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
            vote: vote.bind(null, socket)
        }

        socket.on('disconnect', bindedFunctions.disconnect)
        socket.on('CLIENT_CREATE_ROOM', bindedFunctions.createRoom)
        socket.on('CLIENT_SEND_MESSAGE', bindedFunctions.sendMessage)
        socket.on('CLIENT_JOIN_ROOM', bindedFunctions.joinRoom)
        socket.on('START_VOTING_PHASE_VOTE', bindedFunctions.startVotingPhaseVote)
    })
}
