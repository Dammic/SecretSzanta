import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'
import { createRootReducer } from './ducks/rootDuck'

export const history = createBrowserHistory()

export const store = createStore(
    createRootReducer(history),
    compose(
        applyMiddleware(thunk, routerMiddleware(history)),
        /* eslint-disable no-underscore-dangle */
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        /* eslint-enable */
    ),
)
