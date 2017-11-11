const { forEach, pick } = require('lodash')
const { SocketEvents, ErrorMessages } = require('../Dictionary')

const ClientVerificationHof = (RoomsManager, socket) => {
    const availableChecks = {
        isOwner: () => {
            const { currentRoom, currentPlayerName } = socket
            if (!RoomsManager.isRoomOwner(currentRoom, currentPlayerName)) {
                throw Error(ErrorMessages.notOwner)
            }
        },
    }

    return (checksList, func) => {
        return params => {
            const tests = pick(availableChecks, checksList)
            try {
                forEach(tests, checkFunc => checkFunc(params))
                return func(params)
            } catch (error) {
                socket.emit(SocketEvents.CLIENT_ERROR, { error: error.message })
            }
        }
    }
}

module.exports = ClientVerificationHof

