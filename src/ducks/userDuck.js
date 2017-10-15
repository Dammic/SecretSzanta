import { handleActions, createAction } from 'redux-actions'

// Actions
const SELECT_NAME = 'user/SELECT_NAME'
const JOIN_ROOM = 'user/JOIN_ROOM'
const TOGGLE_AFFILIATION_MENU = 'user/TOGGLE_AFFILIATION_MENU'

const selectName = createAction(SELECT_NAME)
const joinRoom = createAction(JOIN_ROOM)
const toggleAffiliationMenu = createAction(TOGGLE_AFFILIATION_MENU)

const initialState = {
    userName: '',
    roomName: '',
    isAffiliationHidden: false,
}


const actions = {
    [SELECT_NAME]: (state, action) => {
        const { userName } = action.payload
        return {
            ...state,
            userName,
        }
    },
    [JOIN_ROOM]: (state, action) => {
        const { roomName } = action.payload
        return {
            ...state,
            roomName,
        }
    },
    [TOGGLE_AFFILIATION_MENU]: (state) => {
        const { isAffiliationHidden } = state
        return {
            ...state,
            isAffiliationHidden: !isAffiliationHidden,
        }
    },
}

export { selectName, joinRoom, toggleAffiliationMenu }
export default handleActions(actions, initialState)
