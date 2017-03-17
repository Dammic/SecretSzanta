'use strict'
import React from 'react'
import MessagesBox from './MessagesBox/MessagesBox'
import ChatForm from './ChatForm/ChatForm'

const ChatComponent = ({
    socket,
    userName
}) => {
    return (
        <div className="chat">
            <MessagesBox socket={socket} />
            <ChatForm socket={socket} userName={userName}/>
        </div>
    )
}

export default ChatComponent

