import { handleActions, createAction } from 'redux-actions'
import { Views } from '../../Dictionary'

// Actions
const selectName = createAction('user/SELECT_NAME')
const joinRoom = createAction('user/JOIN_ROOM')
const toggleAffiliationMenu = createAction('user/TOGGLE_AFFILIATION_MENU')
const setView = createAction('user/SET_VIEW')

const initialState = {
    userName: '',
    roomName: '',
    isAffiliationHidden: false,
    currentView: null,
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
    [setView]: (state, action) => {
        const { viewName } = action.payload
        const { userName, roomName } = state

        let newView = viewName
        if (viewName === Views.Lobby && !userName) {
            newView = Views.Home
        } else if (viewName === Views.Game && !roomName) {
            newView = Views.Home
        }

        return {
            ...state,
            currentView: newView,
        }
    },
}

export { selectName, joinRoom, toggleAffiliationMenu, setView }
export default handleActions(actions, initialState)
