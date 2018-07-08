import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import chat from './ducks/chatDuck'
import user from './ducks/userDuck'
import room from './ducks/roomDuck'
import notification from './ducks/notificationsDuck'
import players from './ducks/playersDuck'
import modal from './ducks/modalDuck'
import lobby from './ducks/lobbyDuck'

/* eslint-disable no-underscore-dangle */

export const history = createHistory()
const middleware = routerMiddleware(history)

export const store = createStore(
    combineReducers({
        chat,
        user,
        room,
        notification,
        players,
        modal,
        lobby,
        routing: routerReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    compose(
        applyMiddleware(thunk),
        applyMiddleware(middleware),
    ),
)
/* eslint-enable */
