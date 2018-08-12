import { SocketEvents, GlobalRoomName } from '../../Dictionary'
import { emitToRoom, emitToPlayer } from './generic'

import {
    getRoomsList,
    getRoomDetailsForLobby,
} from '../../utils/RoomsManager'
import {
    getPlayersList,
    getPlayerFromPlayersList,
} from '../../utils/PlayersManager'

export const emitRoomsListChanged = (changedRoom, targetRoom = null) => {
    emitToRoom(GlobalRoomName, SocketEvents.RoomsListChanged, {
        roomName: changedRoom,
        room: targetRoom ? getRoomDetailsForLobby(targetRoom) : null,
    })
}

export const emitPlayersListChanged = (playerName) => {
    emitToRoom(GlobalRoomName, SocketEvents.PlayersListChanged, {
        playerName,
        player: getPlayerFromPlayersList(playerName),
    })
}

export const emitSyncLobbyToPlayer = (emit) => {
    emitToPlayer(emit, SocketEvents.SyncLobby, {
        players: getPlayersList(),
        rooms: getRoomsList(),
    })
}

export const emitSelectNameToPlayer = (emit, newName) => {
    emitToPlayer(emit, SocketEvents.SelectName, { userName: newName })
}
