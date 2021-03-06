import { io } from '../io'
import { SocketEvents, PlayerAffilications, GlobalRoomName } from '../../Dictionary'
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

let cancelTimeoutToken

export const resumeGame = (socket, { delay, func, customMessage }) => {
    if (delay) {
        cancelTimeoutToken = setTimeout(func.bind(null, socket), delay)
        emits.emitSetTimer(socket.currentRoom, delay)
    } else {
        func(socket)
    }
}

export const clearNextPhaseTimeout = () => {
    clearTimeout(cancelTimeoutToken)
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
    switchRooms,
}

export default SocketEventsUtils

