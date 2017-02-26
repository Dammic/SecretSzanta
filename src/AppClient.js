'use strict'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import MainPage from './features/MainPage/MainPage'
import LoginPage from './features/LoginPage/LoginPage'

render(
    <Router history={browserHistory}>
        <Route path="/" component={LoginPage}>

        </Route>
    </Router>,
    document.getElementById('root')
)
