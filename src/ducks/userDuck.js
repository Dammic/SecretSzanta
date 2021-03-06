import { handleActions, createAction } from 'redux-actions'
import { Views } from '../../Dictionary'

// Actions
const selectName = createAction('user/SELECT_NAME')
const setRoomName = createAction('user/SET_ROOM_NAME')
const toggleAffiliationMenu = createAction('user/TOGGLE_AFFILIATION_MENU')
const setView = createAction('user/SET_VIEW')

const initialState = {
    userName: '',
    roomName: '',
    isAffiliationHidden: false,
    currentView: Views.Home,
}

const actions = {
    [selectName]: (state, action) => {
        const { userName } = action.payload
        return {
            ...state,
            userName,
        }
    },
    [setRoomName]: (state, action) => {
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
    [setView]: (state, action) => {
        const { viewName } = action.payload
        const { userName, roomName } = state

        let newView = viewName
        if ((viewName === Views.Lobby && !userName) || (viewName === Views.Game && !roomName)) {
            newView = Views.Home
        }

        return {
            ...state,
            currentView: newView,
        }
    },
}

export { selectName, setRoomName, toggleAffiliationMenu, setView }
export default handleActions(actions, initialState)
