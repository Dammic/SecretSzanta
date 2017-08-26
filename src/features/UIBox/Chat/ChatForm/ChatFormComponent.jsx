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
            <input value={typedMessage} onChange={changeMessageText} onKeyPress={handleFormKeyPress} />
            <div className="send-button" onClick={sendMessage} />
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

