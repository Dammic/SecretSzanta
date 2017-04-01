'use strict'
const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp

module.exports = function(io, RoomsManager) {
    const socketMethods = {
        disconnect: function() {
            const playerInfo = RoomsManager.getPlayerInfo(this.currentRoom, this.currentPlayerName)

            this.io.sockets.in(this.currentRoom).emit('CLIENT_LEAVE_ROOM', {
                timestamp: getCurrentTimestamp(),
                playerName: this.currentPlayerName,
                slotID: playerInfo.slotID
            })
            RoomsManager.removePlayer(this.currentRoom, this.currentPlayerName)
            this.currentRoom = ''
            this.currentPlayerName = ''
        },
        createRoom: function({roomName, maxPlayers, password}) {
            // if the room does not exist, create it
            if(!RoomsManager.isRoomPresent(roomName)) {
                RoomsManager.initializeRoom(roomName, maxPlayers, password)

            } else {
                console.error('selected room is already present! Cannot create a duplicate!')
            }
        },
        sendMessage: function({content, author}) {
            this.io.sockets.in(this.currentRoom).emit('CLIENT_SEND_MESSAGE', {
                timestamp: getCurrentTimestamp(),
                author,
                content
            })
        },
        joinRoom: function({playerName, roomName}) {
            if(roomName && this.currentRoom === '' && RoomsManager.isRoomPresent(roomName)) {
                RoomsManager.addPlayer(roomName, playerName)

                const roomDetails = RoomsManager.getRoomDetails(roomName)

                this.socket.emit('CLIENT_GET_ROOM_DATA', roomDetails)

                this.io.sockets.in(roomName).emit('CLIENT_JOIN_ROOM', {
                    timestamp: getCurrentTimestamp(),
                    playerName,
                    playerInfo: RoomsManager.getPlayerInfo(roomName, playerName)
                })

                this.socket.join(roomName)

                this.currentPlayerName = playerName
                this.currentRoom = roomName
            } else {
                this.socket.emit('CLIENT_JOIN_ROOM', {
                    error: 'Error - WHY IS THE ROOM GONE?!'
                })
            }
        }
    }


    io.on('connection', function(socket) {
        this.io = io
        this.socket = socket
        this.currentPlayerName = ''
        this.currentRoom = ''
        socket.on('disconnect', socketMethods.disconnect.bind(this))

        socket.on('CLIENT_CREATE_ROOM', socketMethods.createRoom.bind(this))
        socket.on('CLIENT_SEND_MESSAGE', socketMethods.sendMessage.bind(this))
        socket.on('CLIENT_JOIN_ROOM', socketMethods.joinRoom.bind(this))
    })
}
