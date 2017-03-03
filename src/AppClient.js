'use strict'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import MainPage from './features/MainPage/MainPage'
import LoginPage from './features/LoginPage/LoginPage'
import GameList from './features/GameList/GameList'
import NotFound from './features/NotFound/NotFound'

render(
    <Router history={browserHistory}>
        <Route path="/" component={LoginPage}>
        
        </Route>
        <Route path="*" component={NotFound}/>   
             
    </Router>,
    document.getElementById('root')
)
