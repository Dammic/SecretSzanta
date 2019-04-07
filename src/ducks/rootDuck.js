import { combineReducers } from 'redux'
import { createAction } from 'redux-actions'
import { routerReducer } from 'react-router-redux'

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

const appReducer = combineReducers({
    chat,
    user,
    room,
    notification,
    players,
    modal,
    lobby,
    routing: routerReducer,
})

export const rootReducer = (state, action) => {
    if (action.type === LOGOUT_USER) {
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}
