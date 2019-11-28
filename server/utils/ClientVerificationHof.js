import { forEach, pick, get } from 'lodash'
import { SocketEvents, ErrorMessages } from '../../Dictionary'
import { isRoomOwner, getPresident, getChancellor } from './RoomsManager'
import { logError } from './utils'

class VerificationError extends Error {}

const availableChecks = {
    isOwner: (socket) => {
        const { currentRoom, currentPlayerName } = socket
        if (!isRoomOwner(currentRoom, currentPlayerName)) {
            throw VerificationError(ErrorMessages.notOwner)
        }
    },
    isPresident: (socket) => {
        const { currentRoom, currentPlayerName } = socket
        const president = getPresident(currentRoom)
        if (get(president, 'playerName') !== currentPlayerName) {
            throw VerificationError(ErrorMessages.notPresident)
        }
    },
    isChancellor: (socket) => {
        const { currentRoom, currentPlayerName } = socket
        const chancellor = getChancellor(currentRoom)
        if (get(chancellor, 'playerName') !== currentPlayerName) {
            throw VerificationError(ErrorMessages.notChancellor)
        }
    },
}

const ClientVerificationHof = (checksList, func) => {
    return (socket, params) => {
        const tests = pick(availableChecks, checksList)
        try {
            forEach(tests, checkFunc => checkFunc(socket))
        } catch (error) {
            if (!(error instanceof VerificationError)) {
                throw error
            }
            logError(socket, error.message)
            socket.emit(SocketEvents.CLIENT_ERROR, { error: error.message })
        }
        return func(socket, params)
    }
}

export default ClientVerificationHof
