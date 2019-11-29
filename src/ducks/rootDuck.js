import { combineReducers } from 'redux'
import { createAction } from 'redux-actions'
import { connectRouter } from 'connected-react-router'

import chat from './chatDuck'
import user from './userDuck'
import room from './roomDuck'
import notification from './notificationsDuck'
import players from './playersDuck'
import modal from './modalDuck'
import lobby from './lobbyDuck'

const LOGOUT_USER = 'root/USER_LOGOUT'

// Actions
export const logoutUser = createAction(LOGOUT_USER)

const appReducer = (history) => combineReducers({
    chat,
    user,
    room,
    notification,
    players,
    modal,
    lobby,
    router: connectRouter(history),
})

export const createRootReducer = (history) => (state, action) => {
    if (action.type === LOGOUT_USER) {
        return appReducer(history)(undefined, action)
    }

    return appReducer(history)(state, action)
}
