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
        this.socket.emit(CLIENT_JOIN_ROOM, { playerName: this.props.userName, roomName: 'example' })
    }

    render () {
        const fakeTitle = 'traveler'
        console.log(this.socket)
        return (
            <MainPageComponent title={fakeTitle} userNames={testMock} socket={this.socket} userName={this.props.userName}/>
        )
    }
}
