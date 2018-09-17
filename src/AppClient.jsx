import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router'

import { store, history } from './store'

import LandingPage from './features/LandingPage/LandingPage'
import NotFound from './features/NotFound/NotFound'

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="*" component={NotFound} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)
