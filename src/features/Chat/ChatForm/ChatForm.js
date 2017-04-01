'use strict'
import React from 'react'
import ChatFormComponent from './ChatFormComponent'
import {CLIENT_SEND_MESSAGE} from '../../../const/SocketEvents'

export default class ChatForm extends React.PureComponent {

    componentWillMount () {
        this.state = {
            typedMessage: ''
        }
    }

    sendMessage () {
        const {typedMessage} = this.state
        const {userName} = this.props

        if (typedMessage) {
            const {socket} = this.props
            socket.emit(CLIENT_SEND_MESSAGE, {
                author: userName,
                content: typedMessage
            })
            this.setState({
                typedMessage: ''
            })
        }
    }

    handleFormKeyPress (event) {
        if (event.key === 'Enter') {
            this.sendMessage()
        }
    }

    changeMessageText (event) {
        this.setState({typedMessage: event.target.value})
    }

    render () {
        const {typedMessage} = this.state
        const {socket} = this.props
        return (
            <ChatFormComponent
                sendMessage={this.sendMessage.bind(this)}
                typedMessage={typedMessage}
                handleFormKeyPress={this.handleFormKeyPress.bind(this)}
                changeMessageText={this.changeMessageText.bind(this)}
                socket={socket} />
        )
    }
}
