import React from 'react'
import PropTypes from 'prop-types'
import MessagesBox from './MessagesBox/MessagesBox'
import ChatForm from './ChatForm/ChatForm'

const ChatComponent = ({
    userName,
}) => {
    return (
        <div className="chat">
            <MessagesBox />
            <ChatForm userName={userName} />
        </div>
    )
}

ChatComponent.propTypes = {
    userName: PropTypes.string,
}
export default ChatComponent

