'use strict'
import React from 'react'

const MessagesBoxComponent = ({
    messages = []
}) => {
    const buildMessage = (message) => {
        const {timestamp, time, author, content} = message
        return (
            <div key={timestamp} className="message">
                [{time}] {author === 'SERVER' ? '' : author}: {content}
            </div>
        )
    }

    return (
        <div className="messages-box">
            {messages.map((message) => buildMessage(message))}
        </div>
    )
}

export default MessagesBoxComponent


