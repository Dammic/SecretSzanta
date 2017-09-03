import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import classNames from 'classnames/bind'

const MessagesBoxComponent = ({
    messages = [],
    setMessagesEndRef,
}) => {
    const buildMessage = (message, index) => {
        const { time, author, content } = message
        return (
            <div key={index} className={classNames('message', { 'server-message': !author })}>
                [{time}]{author ? ` ${author}: ` : ':'} {content}
            </div>
        )
    }

    return (
        <div className="messages-box">
            {map(messages, (message, index) => buildMessage(message, index))}
            <div id="EndOfMessages" ref={setMessagesEndRef} />
        </div>
    )
}

MessagesBoxComponent.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    setMessagesEndRef: PropTypes.func,
}
export default MessagesBoxComponent

