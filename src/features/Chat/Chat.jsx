import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MessagesBox from './MessagesBox/MessagesBox'
import ChatForm from './ChatForm/ChatForm'

import styles from './Chat.css'

const Chat = ({
    className,
}) => (
    <div className={classNames(styles.chat, className)}>
        <MessagesBox />
        <ChatForm />
    </div>
)

Chat.displayName = 'Chat'
Chat.propTypes = {
    className: PropTypes.string,
}
export default Chat


