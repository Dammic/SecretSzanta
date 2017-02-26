'use strict'
import React from 'react'
import ChatComponent from './ChatComponent'
import IO from 'socket.io-client'

export default class Chat extends React.PureComponent {

    componentDidMount() {
        const socket = IO()
        socket.on('server event', (data) => {
            console.info(data)
            socket.emit('client event', { socket: 'io' })
        })
    }

    render () {
        return (
            <ChatComponent />
        )
    }
}
