import { cloneDeep } from 'lodash'
import { handleActions, createAction } from 'redux-actions'

// Actions
const syncLobby = createAction('lobby/SYNC_LOBBY')
const changePlayerInPlayersList = createAction('lobby/CHANGE_PLAYER_IN_PLAYERS_LIST')
const changeRoomInRoomsList = createAction('lobby/CHANGE_ROOM_IN_ROOMS_LIST')

const initialState = {
    // playersList has structure: { avatarNumber, playerName, currentRoom }
    playersList: {},
    roomsList: {},
}

const actions = {
    [syncLobby]: (state, { payload: { players, rooms } }) => ({
        ...state,
        playersList: players,
        roomsList: rooms,
    }),

    // passing empty player results in player removal from list
    [changePlayerInPlayersList]: (state, action) => {
        const { player, playerName } = action.payload
        const newPlayersList = cloneDeep(state.playersList)
        if (playerName && player) {
            newPlayersList[playerName] = player
        } else {
            delete newPlayersList[playerName]
        }
        return {
            ...state,
            playersList: newPlayersList,
        }
    },

    // passing empty room results in room removal from list
    [changeRoomInRoomsList]: (state, action) => {
        const { room, roomName } = action.payload
        const newRoomsList = cloneDeep(state.roomsList)
        if (roomName && room) {
            newRoomsList[roomName] = room
        } else {
            delete newRoomsList[roomName]
        }
        return {
            ...state,
            roomsList: newRoomsList,
        }
    },
}

export { syncLobby, changePlayerInPlayersList, changeRoomInRoomsList }
export default handleActions(actions, initialState)
