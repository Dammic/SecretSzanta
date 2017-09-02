import React from 'react'
import PropTypes from 'prop-types'

const ChatComponent = ({
    sendMessage,
    typedMessage,
    changeMessageText,
    handleFormKeyPress,
}) => {
    return (
        <div className="chat-form">
            <input className="send-input" value={typedMessage} onChange={changeMessageText} onKeyPress={handleFormKeyPress} autoFocus />
            <div className="send-button" onClick={sendMessage}>
                <i className="fa fa-envelope" aria-hidden="true" />
            </div>
        </div>
    )
}

ChatComponent.propTypes = {
    sendMessage: PropTypes.func,
    typedMessage: PropTypes.string,
    changeMessageText: PropTypes.func,
    handleFormKeyPress: PropTypes.func,
}
export default ChatComponent

