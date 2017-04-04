'use strict'
import React from 'react'
import MessagesBoxComponent from './MessagesBoxComponent'
import moment from 'moment'
import {CLIENT_SEND_MESSAGE, CLIENT_JOIN_ROOM, CLIENT_LEAVE_ROOM} from '../../../const/SocketEvents'

export default class MessagesBox extends React.PureComponent {
    componentWillMount () {
        this.state = {
            messages: [],
            messageIndex: 1
        }
        this.messagesBoxRef = null
    }
    componentDidMount () {
        const {socket} = this.props
        socket.on(CLIENT_SEND_MESSAGE, (data) => {
            this.addMessage(data)
        })

        socket.on(CLIENT_JOIN_ROOM, (data) => {
            const message = {
                timestamp: data.timestamp,
                author: '',
                content: `${data.playerName} has joined the room!`
            }
            this.addMessage(message)
        })

        socket.on(CLIENT_LEAVE_ROOM, (data) => {
            const message = {
                timestamp: data.timestamp,
                author: '',
                content: `${data.playerName} has left the room!`
            }
            this.addMessage(message)
        })
    }

    addMessage (data) {
        const {messages, messageIndex} = this.state
        const {author, content, timestamp} = data
        this.setState({
            messages: [...messages, {
                author,
                content,
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                messageIndex
            }],
            messageIndex: messageIndex + 1
        })

        // scrolling to the bottom of messages list
        this.messagesBoxRef.scrollTop = this.messagesBoxRef.scrollHeight
    }

    setMessagesBoxRef (ref) {
        this.messagesBoxRef = ref
    }

    render () {
        const {messages} = this.state
        return (
            <MessagesBoxComponent
                messages={messages}
                setMessagesBoxRef={this.setMessagesBoxRef.bind(this)} />
        )
    }
}
