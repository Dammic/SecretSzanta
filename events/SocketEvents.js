'use strict'
const getCurrentTimestamp = require('../utils/utils').getCurrentTimestamp

module.exports = function(io, RoomsManager) {
    const disconnect = function() {
        if(this.currentRoom) {
            const playerInfo = RoomsManager.getPlayerInfo(this.currentRoom, this.currentPlayerName)

            io.sockets.in(this.currentRoom).emit('CLIENT_LEAVE_ROOM', {
                timestamp: getCurrentTimestamp(),
                playerName: this.currentPlayerName,
                slotID: playerInfo.slotID
            })
            if(RoomsManager.isRoomPresent(this.currentRoom)) {
                RoomsManager.removePlayer(this.currentRoom, this.currentPlayerName)
            }
            this.currentRoom = ''
        }

        this.currentPlayerName = ''
    }

    const createRoom = function({roomName, maxPlayers, password}) {
        // if the room does not exist, create it
        if(roomName && !RoomsManager.isRoomPresent(roomName)) {
            RoomsManager.initializeRoom(roomName, maxPlayers, password)
        } else {
            //console.error('selected room is already present! Cannot create a duplicate!')
        }
    }

    const sendMessage = function({content, author}) {
        io.sockets.in(this.currentRoom).emit('CLIENT_SEND_MESSAGE', {
            timestamp: getCurrentTimestamp(),
            author,
            content
        })
    }

    const joinRoom = function({playerName, roomName}) {
        if(roomName && this.currentRoom === '' && RoomsManager.isRoomPresent(roomName)) {
            RoomsManager.addPlayer(roomName, playerName)

            const roomDetails = RoomsManager.getRoomDetails(roomName)

            this.emit('CLIENT_GET_ROOM_DATA', roomDetails)

            io.sockets.in(roomName).emit('CLIENT_JOIN_ROOM', {
                timestamp: getCurrentTimestamp(),
                playerName,
                playerInfo: RoomsManager.getPlayerInfo(roomName, playerName)
            })

            this.join(roomName)

            this.currentPlayerName = playerName
            this.currentRoom = roomName
        } else {
            this.emit('CLIENT_JOIN_ROOM', {
                error: 'Error - WHY IS THE ROOM GONE?!'
            })
        }
    }


    io.on('connection', (socket) => {
        socket.currentPlayerName = ''
        socket.currentRoom = ''

        // to avoid creating new binded functions each time an action is made. This is made only once.
        // we need a way to pass socket object into those functions and we do it by passing it as *this*
        const bindedFunctions = {
            disconnect: disconnect.bind(socket),
            createRoom: createRoom.bind(socket),
            sendMessage: sendMessage.bind(socket),
            joinRoom: joinRoom.bind(socket)
        }

        socket.on('disconnect', bindedFunctions.disconnect)
        socket.on('CLIENT_CREATE_ROOM', bindedFunctions.createRoom)
        socket.on('CLIENT_SEND_MESSAGE', bindedFunctions.sendMessage)
        socket.on('CLIENT_JOIN_ROOM', bindedFunctions.joinRoom)
    })
}
