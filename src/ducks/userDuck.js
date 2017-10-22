import { handleActions, createAction } from 'redux-actions'

// Actions
const selectName = createAction('user/SELECT_NAME')
const joinRoom = createAction('user/JOIN_ROOM')
const toggleAffiliationMenu = createAction('user/TOGGLE_AFFILIATION_MENU')

const initialState = {
    userName: '',
    roomName: '',
    isAffiliationHidden: false,
}


const actions = {
    [selectName]: (state, action) => {
        const { userName } = action.payload
        return {
            ...state,
            userName,
        }
    },
    [joinRoom]: (state, action) => {
        const { roomName } = action.payload
        return {
            ...state,
            roomName,
        }
    },
    [toggleAffiliationMenu]: (state) => {
        const { isAffiliationHidden } = state
        return {
            ...state,
            isAffiliationHidden: !isAffiliationHidden,
        }
    },
}

export { selectName, joinRoom, toggleAffiliationMenu }
export default handleActions(actions, initialState)
