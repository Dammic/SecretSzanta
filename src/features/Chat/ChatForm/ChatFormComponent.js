import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '../../Shared/Icon'

import styles from './ChatForm.module.css'

const ChatFormComponent = ({
    sendMessage,
    typedMessage,
    changeMessageText,
    handleFormKeyPress,
}) => (
    <div className={styles.chatForm}>
        <input className={styles.sendInput} value={typedMessage} onChange={changeMessageText} onKeyPress={handleFormKeyPress} />
        <div className={styles.sendButton} onClick={sendMessage}>
            <Icon name="fa-envelope" />
        </div>
    </div>
)

ChatFormComponent.displayName = 'ChatFormComponent'
ChatFormComponent.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    typedMessage: PropTypes.string.isRequired,
    changeMessageText: PropTypes.func.isRequired,
    handleFormKeyPress: PropTypes.func.isRequired,
}
export default ChatFormComponent

