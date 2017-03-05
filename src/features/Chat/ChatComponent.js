'use strict'
import React from 'react'
import MessagesBox from './MessagesBox/MessagesBox'

const ChatComponent = ({
    sendMessage,
    typedMessage,
    changeMessageText,
    socket
}) => {

    return (
        <div className="chat">
            <MessagesBox socket={socket} />
            <div className="chat-form">
                <input value={typedMessage} onChange={changeMessageText} />
                <div className="send-button" onClick={sendMessage}></div>
            </div>
        </div>
    )
}

export default ChatComponent


