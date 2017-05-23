'use strict'
import React from 'react'
import classNames from 'classnames/bind'

const MessagesBoxComponent = ({
    messages = [],
    setMessagesEndRef
}) => {
    const buildMessage = (message, index) => {
        const {time, author, content} = message
        return (
            <div key={index} className={classNames("message", {'server-message': !author})}>
                [{time}]{author ? ` ${author}: ` : ':'} {content}
            </div>
        )
    }

    return (
        <div className="messages-box">
            {messages.map((message, index) => buildMessage(message, index))}
            <div id="EndOfMessages" ref={setMessagesEndRef} />
        </div>
    )
}

export default MessagesBoxComponent

