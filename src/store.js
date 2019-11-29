import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'
import { createRootReducer } from './ducks/rootDuck'

export const history = createBrowserHistory()

export const store = createStore(
    createRootReducer(history),
    composeWithDevTools(
        applyMiddleware(thunk, routerMiddleware(history)),
    ),
)
