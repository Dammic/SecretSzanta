'use strict'
import React from 'react'

const MessagesBoxComponent = ({
    messages = [],
    setMessagesBoxRef
}) => {
    const buildMessage = (message) => {
        const {time, author, content, messageIndex} = message
        return (
            <div key={messageIndex} className="message">
                [{time}] {author}: {content}
            </div>
        )
    }

    return (
        <div className="messages-box" ref={setMessagesBoxRef}>
            {messages.map((message) => buildMessage(message))}
        </div>
    )
}

export default MessagesBoxComponent

