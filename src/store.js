import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { rootReducer } from './ducks/rootDuck'

/* eslint-disable no-underscore-dangle */
export const history = createBrowserHistory()
const router = routerMiddleware(history)

export const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk, router),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
)
/* eslint-enable */
