'use strict'
import React from 'react'
import ChatComponent from './ChatComponent'
import IO from 'socket.io-client'
import {CLIENT_SEND_MESSAGE} from '../../const/SocketEvents'

export default class Chat extends React.PureComponent {

    componentWillMount () {
        this.state = {
            typedMessage: ''
        }
        this.socket = IO()
    }
    componentDidMount () {
        this.socket.on('server event', (data) => {
            console.info(data)
            this.socket.emit('client event', { socket: 'io' })
        })
        this.socket.on('CLIENT_SEND_MESSAGE', (data) => {
            console.info(data)
        })
    }

    sendMessage () {
        const {typedMessage} = this.state
        this.socket.emit('CLIENT_SEND_MESSAGE', { newMessage: typedMessage })
    }

    changeMessageText(event) {
        this.setState({typedMessage: event.target.value})
    }

    render () {
        const {typedMessage} = this.state
        return (
            <ChatComponent
                sendMessage={this.sendMessage.bind(this)}
                typedMessage={typedMessage}
                changeMessageText={this.changeMessageText.bind(this)} />
        )
    }
}
