import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MessagesBox from './MessagesBox/MessagesBox'
import ChatForm from './ChatForm/ChatForm'

import styles from './Chat.css'

const ChatComponent = ({
    userName,
    className,
}) => {
    return (
        <div className={classNames(styles.chat, className)}>
            <MessagesBox />
            <ChatForm userName={userName} />
        </div>
    )
}

ChatComponent.propTypes = {
    userName: PropTypes.string,
    className: PropTypes.string,
}
export default ChatComponent

