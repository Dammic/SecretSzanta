'use strict'
import React from 'react'
import MessagesBox from './MessagesBox/MessagesBox'
import ChatForm from './ChatForm/ChatForm'

const ChatComponent = ({
    userName
}) => {
    return (
        <div className="chat">
            <MessagesBox />
            <ChatForm userName={userName}/>
        </div>
    )
}

export default ChatComponent

