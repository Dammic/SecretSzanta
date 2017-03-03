'use strict'
import React from 'react'
import LoginPageComponent from './LoginPageComponent'
import {testMock} from '../../const/testMock'

export default class MainPage extends React.Component {

    render () {
        const fakeTitle = 'traveler'
        return (
            <LoginPageComponent onSetNameClick={this.setName()}/>
        )
    }

    setName () {

    }
}
