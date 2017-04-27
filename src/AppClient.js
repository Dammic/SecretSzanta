'use strict'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'

import chat from './ducks/chatDuck'

import GameRoom from './features/GameRoom/GameRoom'
import LoginPage from './features/LoginPage/LoginPage'
import GameList from './features/GameList/GameList'
import NotFound from './features/NotFound/NotFound'

/* eslint-disable no-underscore-dangle */
const store = createStore(
    combineReducers({
        chat,
        routing: routerReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    compose(
        applyMiddleware(thunk)
    )
)
/* eslint-enable */

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={LoginPage} />
            <Route path="*" component={NotFound} />
        </Router>
    </Provider>,
    document.getElementById('root')
)
