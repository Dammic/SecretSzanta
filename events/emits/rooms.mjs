import { SocketEvents } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'
import { emitToRoom, emitToPlayer } from './generic'
import {
    getRoomDetails,
    getPlayerInfo,
} from '../../utils/RoomsManager'

export const emitPlayerLeftRoom = (room, playerName) => emitToRoom(room, SocketEvents.CLIENT_LEAVE_ROOM, {
    timestamp: getCurrentTimestamp(),
    playerName,
})

export const emitRoomData = (room, emit) => {
    const roomDetails = getRoomDetails(room)
    emitToPlayer(emit, SocketEvents.CLIENT_GET_ROOM_DATA, {
        ...roomDetails,
    })
}

export const emitAllowEnteringRoom = (room, emit) => {
    emitToPlayer(emit, SocketEvents.AllowEnteringRoom, {
        roomName: room,
    })
}

export const emitPlayerJoinedRoom = (room, playerName) => {
    emitToRoom(room, SocketEvents.CLIENT_JOIN_ROOM, {
        timestamp: getCurrentTimestamp(),
        player: getPlayerInfo(room, playerName),
    })
}

export const emitPlayerKicked = (room, playerName, wasBanned, isOverlaysHidingNeeded) => {
    emitToRoom(room, SocketEvents.PlayerKicked, {
        playerName,
        timestamp: getCurrentTimestamp(),
        wasBanned,
        isOverlaysHidingNeeded,
    })
}

export const emitSetTimer = (room, delay) => {
    emitToRoom(room, SocketEvents.SetTimer, { waitTime: delay })
}

export const emitChooserPlayer = (room, playerName) => {
    emitToRoom(room, SocketEvents.SetChooserPlayer, { playerName })
}

