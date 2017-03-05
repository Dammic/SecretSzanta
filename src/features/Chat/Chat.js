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
        this.socket.emit('CLIENT_JOIN_ROOM', { playerName: '69aNaLpReDaToR69' })
    }

    sendMessage () {
        const {typedMessage, messageIndex} = this.state
        const author = '69aNaLpReDaToR69'
        this.socket.emit('CLIENT_SEND_MESSAGE', {
            author,
            content: typedMessage
        })
        this.setState({
            typedMessage: ''
        })
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
                changeMessageText={this.changeMessageText.bind(this)}
                socket={this.socket} />
        )
    }
}
