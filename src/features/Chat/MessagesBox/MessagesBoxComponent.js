'use strict'
import React from 'react'

const MessagesBoxComponent = ({
    messages = [],
    setMessagesBoxRef
}) => {
    const buildMessage = (message, index) => {
        const {time, author, content, messageIndex} = message
        return (
            <div key={index} className="message">
                [{time}] {author}: {content}
            </div>
        )
    }

    return (
        <div className="messages-box" ref={setMessagesBoxRef}>
            {messages.map((message, index) => buildMessage(message, index))}
        </div>
    )
}

export default MessagesBoxComponent

