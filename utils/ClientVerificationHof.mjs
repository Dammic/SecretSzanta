import lodash from 'lodash'
import { SocketEvents, ErrorMessages } from '../Dictionary'
import { isRoomOwner, getPresident, getChancellor } from './RoomsManager'

const { forEach, pick, get } = lodash

const ClientVerificationHof = () => {
    const availableChecks = {
        isOwner: (socket) => {
            const { currentRoom, currentPlayerName } = socket
            if (!isRoomOwner(currentRoom, currentPlayerName)) {
                throw Error(ErrorMessages.notOwner)
            }
        },
        isPresident: (socket) => {
            const { currentRoom, currentPlayerName } = socket
            const president = getPresident(currentRoom)
            if (get(president, 'playerName') !== currentPlayerName ) {
                throw Error(ErrorMessages.notPresident)
            }
        },
        isChancellor: (socket) => {
            const { currentRoom, currentPlayerName } = socket
            const chancellor = getChancellor(currentRoom)
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

export default ClientVerificationHof

