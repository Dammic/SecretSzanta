'use strict'
import React from 'react'

const ChatComponent = ({
    sendMessage,
    typedMessage,
    messages = [],
    changeMessageText
}) => {
    return (
        <div className="chat">
            <div className="messages-box">
                {messages.map((message) => {
                    return (
                        <div key={message.content} className="message">
                            {message.name} said: {message.content}
                        </div>
                    )
                })}
            </div>
            <div className="chat-form">
                <input value={typedMessage} onChange={changeMessageText} />
                <div className="send-button" onClick={sendMessage}></div>
            </div>
        </div>
    )
}

export default ChatComponent


