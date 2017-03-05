'use strict'
import React from 'react'
import MessagesBoxComponent from './MessagesBoxComponent'
import moment from 'moment'

export default class MessagesBox extends React.PureComponent {
    componentWillMount () {
        this.state = {
            messages: []
        }
    }
    componentDidMount () {
        const {socket} = this.props
        socket.on('CLIENT_SEND_MESSAGE', (data) => {
            const {messages} = this.state
            const {author, content, timestamp} = data
            this.setState({messages: [...messages, {
                author,
                content,
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                timestamp
            }]})
        })

        socket.on('CLIENT_JOIN_ROOM', (data) => {
            const {messages} = this.state
            const {playerName, timestamp} = data

            this.setState({messages: [...messages, {
                author: 'SERVER',
                content: `${playerName} has joined the server!`,
                time: moment.unix(timestamp).format('MM/DD/YYYY/HH:mm:ss'),
                timestamp,
            }]})
        })
    }

    render () {
        const {messages} = this.state
        return (
            <MessagesBoxComponent messages={messages}/>
        )
    }
}
