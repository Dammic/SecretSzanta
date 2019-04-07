import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { rootReducer } from './ducks/rootDuck'

/* eslint-disable no-underscore-dangle */
export const history = createHistory()
const router = routerMiddleware(history)

export const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    compose(
        applyMiddleware(thunk),
        applyMiddleware(router),
    ),
)
/* eslint-enable */
