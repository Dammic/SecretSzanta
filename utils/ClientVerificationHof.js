const { forEach, pick, get } = require('lodash')
const { SocketEvents, ErrorMessages } = require('../Dictionary')

const ClientVerificationHof = (RoomsManager) => {
    const availableChecks = {
        isOwner: (socket) => {
            const { currentRoom, currentPlayerName } = socket
            if (!RoomsManager.isRoomOwner(currentRoom, currentPlayerName)) {
                throw Error(ErrorMessages.notOwner)
            }
        },
        isPresident: (socket) => {
            const { currentRoom, currentPlayerName } = socket
            const president = RoomsManager.getPresident(currentRoom)
            if (get(president, 'playerName') !== currentPlayerName ) {
                throw Error(ErrorMessages.notPresident)
            }
        },
        isChancellor: (socket) => {
            const { currentRoom, currentPlayerName } = socket
            const chancellor = RoomsManager.getChancellor(currentRoom)
            if (get(chancellor, 'playerName') !== currentPlayerName ) {
                throw Error(ErrorMessages.notChancellor)
            }
        },
    }

    return (checksList, func) => {
        return (socket, params) => {
            const tests = pick(availableChecks, checksList)
            try {
                forEach(tests, checkFunc => checkFunc(socket))
                return func(socket, params)
            } catch (error) {
                socket.emit(SocketEvents.CLIENT_ERROR, { error: error.message })
            }
        }
    }
}

module.exports = ClientVerificationHof

