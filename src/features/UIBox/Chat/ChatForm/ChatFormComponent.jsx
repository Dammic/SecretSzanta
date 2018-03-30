import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '../../../Shared/Icon'

import styles from './ChatForm.css'

const ChatComponent = ({
    sendMessage,
    typedMessage,
    changeMessageText,
    handleFormKeyPress,
}) => {
    return (
        <div className={styles.chatForm}>
            <input className={styles.sendInput} value={typedMessage} onChange={changeMessageText} onKeyPress={handleFormKeyPress} autoFocus />
            <div className={styles.sendButton} onClick={sendMessage}>
                <Icon name="fa-envelope" />
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

