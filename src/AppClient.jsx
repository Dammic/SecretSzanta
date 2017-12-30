import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { Route, Switch } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import thunk from 'redux-thunk'

import chat from './ducks/chatDuck'
import user from './ducks/userDuck'
import room from './ducks/roomDuck'
import notification from './ducks/notificationsDuck'
import players from './ducks/playersDuck'
import modal from './ducks/modalDuck'
import lobby from './ducks/lobbyDuck'

import LandingPage from './features/LandingPage/LandingPage'
import NotFound from './features/NotFound/NotFound'

const history = createHistory()
const middleware = routerMiddleware(history)

/* eslint-disable no-underscore-dangle */
const store = createStore(
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

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={LandingPage} />
                <Route path="*" component={NotFound} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)
