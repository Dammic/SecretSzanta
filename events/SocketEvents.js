'use strict'
const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp
console.info(getCurrentTimestamp)

module.exports = function(io, RoomsManager) {

    io.on('connection', (socket) => {
        let currentPlayerName = ''
        let currentRoom = ''
        socket.on('disconnect', function() {
            const playerInfo = RoomsManager.getPlayerInfo(currentRoom, currentPlayerName)

            io.sockets.in(currentRoom).emit('CLIENT_LEAVE_ROOM', {
                timestamp: getCurrentTimestamp(),
                playerName: currentPlayerName,
                slotID: playerInfo.slotID
            })
            RoomsManager.removePlayer(currentRoom, currentPlayerName)
            currentRoom = ''
            currentPlayerName = ''
        })

        socket.on('CLIENT_SEND_MESSAGE', (data) => {
            const {content, author} = data
            io.sockets.in(currentRoom).emit('CLIENT_SEND_MESSAGE', {
                timestamp: getCurrentTimestamp(),
                author,
                content
            })
        })
        socket.on('CLIENT_JOIN_ROOM', (data) => {
            const {playerName, roomName} = data
            if(roomName && currentRoom === '') {

                // if the room does not exist, create it
                if(!RoomsManager.isRoomPresent(roomName)) {
                    RoomsManager.initializeRoom(roomName, 10)
                }
                RoomsManager.addPlayer(roomName, playerName)

                const roomDetails = RoomsManager.getRoomDetails(roomName)

                socket.emit('CLIENT_GET_ROOM_DATA', roomDetails)

                io.sockets.in(roomName).emit('CLIENT_JOIN_ROOM', {
                    timestamp: getCurrentTimestamp(),
                    playerName,
                    playerInfo: RoomsManager.getPlayerInfo(roomName, playerName)
                })

                socket.join(roomName)

                currentPlayerName = playerName
                currentRoom = roomName
            } else {
                socket.emit('CLIENT_JOIN_ROOM', {
                    error: 'Error - Could not join the room!'
                })
            }
        })
    })
}