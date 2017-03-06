'use strict'
require('../../styles/main.scss')
import React from 'react'
import IO from 'socket.io-client'
import MainPageComponent from './MainPageComponent'
import {testMock} from '../../const/testMock'
import {CLIENT_JOIN_ROOM} from '../../const/SocketEvents'

export default class MainPage extends React.PureComponent {
    componentWillMount () {
        this.socket = IO()
    }
    componentDidMount () {
        this.socket.emit(CLIENT_JOIN_ROOM, { playerName: '69aNaLpReDaToR69', roomName: 'example' })
    }

    render () {
        const fakeTitle = 'traveler'
        return (
            <MainPageComponent title={fakeTitle} userNames={testMock} socket={this.socket} />
        )
    }
}
