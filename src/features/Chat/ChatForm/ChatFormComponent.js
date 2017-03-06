'use strict'
import React from 'react'

const ChatComponent = ({
    sendMessage,
    typedMessage,
    changeMessageText,
    handleFormKeyPress
}) => {
    return (
        <div className="chat-form">
            <input value={typedMessage} onChange={changeMessageText} onKeyPress={handleFormKeyPress} />
            <div className="send-button" onClick={sendMessage}></div>
        </div>
    )
}

export default ChatComponent

