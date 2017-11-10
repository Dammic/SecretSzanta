import { cloneDeep } from 'lodash'
import { handleActions, createAction } from 'redux-actions'

// Actions
const setPlayersList = createAction('players/SET_PLAYERS_LIST')
const changePlayerInPlayersList = createAction('players/CHANGE_PLAYER_IN_PLAYERS_LIST')

const initialState = {
    // playersList has structure: { avatarNumber, playerName, currentRoom }
    playersList: {},
    roomsList: {},
}

const actions = {
    [setPlayersList]: (state, { payload: { players } }) => ({
        ...state,
        playersList: players,
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
}

export { setPlayersList, changePlayerInPlayersList }
export default handleActions(actions, initialState)
