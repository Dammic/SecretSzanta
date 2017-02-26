'use strict'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import MainPage from './features/MainPage/MainPage'


render(
    <Router history={browserHistory}>
        <Route path="/" component={MainPage}>

        </Route>
    </Router>,
    document.getElementById('root')
)
