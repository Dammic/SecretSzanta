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
        const {userName} = this.props
        this.socket.emit(CLIENT_JOIN_ROOM, { playerName: userName, roomName: 'example' })
    }

    render () {
        const fakeTitle = 'traveler'
        const {userName} = this.props
        console.log(this.socket)
        return (
            <MainPageComponent title={fakeTitle} userNames={testMock} socket={this.socket} userName={userName}/>
        )
    }
}
