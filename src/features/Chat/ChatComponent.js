'use strict'
import React from 'react'
import MessagesBox from './MessagesBox/MessagesBox'
import ChatForm from './ChatForm/ChatForm'

const ChatComponent = ({
    socket
}) => {
    return (
        <div className="chat">
            <MessagesBox socket={socket} />
            <ChatForm socket={socket} />
        </div>
    )
}

export default ChatComponent


