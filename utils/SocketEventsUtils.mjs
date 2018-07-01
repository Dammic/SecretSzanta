import lodash from 'lodash'
import { io } from '../io'
import { SocketEvents, PlayerAffilications, GlobalRoomName } from '../Dictionary'
import { getCurrentTimestamp } from './utils'
import {
    resetFailedElectionsCount,
    getRoomsList,
    getRoomDetailsForLobby,
    getFailedElectionsCount,
} from './RoomsManager'
import {
    updatePlayerRoom,
    getPlayersList,
    getPlayerFromPlayersList,
} from './PlayersManager'
import * as emits from '../events/emits'

const { pick, map } = lodash

let cancelTimeoutToken

export const resumeGame = (socket, { delay, func, customMessage }) => {
    if (delay) {
        emits.emitMessage(socket.currentRoom, null, { content: customMessage || `Next phase will begin in ${delay / 1000} seconds!` })
        cancelTimeoutToken = setTimeout(func.bind(null, socket), delay)
        emits.emitSetTimer(socket.currentRoom, delay)
    } else {
        func(socket)
    }
}

export const clearNextPhaseTimeout = () => {
    clearTimeout(cancelTimeoutToken)
}

export const resetElectionTracker = (socket) => {
    const trackerPosition = getFailedElectionsCount(socket.currentRoom)

    resetFailedElectionsCount(socket.currentRoom)
    emits.emitResetTracker()

    const trackerMessage = `The failed elections tracker${trackerPosition === 3 ? ' has reached 3, so it' : ''} will be reset!`
    emits.emitMessage(socket.currentRoom, null, { content: trackerMessage })
}

export const switchRooms = (socket, startRoom, targetRoom) => {
    if (startRoom) {
        socket.leave(startRoom)
        emits.emitMessage(socket.currentRoom, null, { content: `${socket.currentPlayerName} has left the room` })

        const updatedRoom = (startRoom === GlobalRoomName ? targetRoom : startRoom)
        if (updatedRoom) {
            emits.emitRoomsListChanged(updatedRoom, updatedRoom)
        }
    }
    socket.currentRoom = targetRoom
    if (targetRoom) {
        if (startRoom) {
            updatePlayerRoom(socket.currentPlayerName, targetRoom)
        }

        if (targetRoom === GlobalRoomName) {
            emits.emitSyncLobbyToPlayer(socket.emit)
        }
        socket.join(targetRoom)
        emits.emitMessage(socket.currentRoom, null, { content: `${socket.currentPlayerName} has joined the room` })
    }
    emits.emitPlayersListChanged(socket.currentPlayerName)
}

const SocketEventsUtils = {
    resumeGame,
    clearNextPhaseTimeout,
    resetElectionTracker,
    switchRooms,
}

export default SocketEventsUtils

