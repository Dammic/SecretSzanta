'use strict'
import React from 'react'
import ChatComponent from './ChatComponent'

export default class Chat extends React.PureComponent {
    render () {
        const {socket} = this.props
        const {userName} = this.props
        return (
            <ChatComponent socket={socket} userName={userName}/>
        )
    }
}
