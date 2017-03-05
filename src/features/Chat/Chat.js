'use strict'
import React from 'react'
import ChatComponent from './ChatComponent'
import IO from 'socket.io-client'
import {CLIENT_SEND_MESSAGE} from '../../const/SocketEvents'

export default class Chat extends React.PureComponent {

    componentWillMount () {
        this.socket = IO()
    }
    componentDidMount () {
        this.socket.emit('CLIENT_JOIN_ROOM', { playerName: '69aNaLpReDaToR69' })
    }

    render () {
        return (
            <ChatComponent socket={this.socket} />
        )
    }
}
