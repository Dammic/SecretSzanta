import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import classNames from 'classnames/bind'

import styles from './MessagesBox.css'

const buildMessage = (message, index) => {
    const { time, author, content } = message
    const displayedMessage = `[${time}]${author ? ` ${author}: ` : ':'} ${content}`

    return (
        <div key={index} className={classNames(styles.message, { [styles.serverMessage]: !author })}>
            {displayedMessage}
        </div>
    )
}

const MessagesBoxComponent = ({
    messages = [],
    setMessagesBoxRef,
}) => (
    <div className={styles.messagesBox} ref={setMessagesBoxRef}>
        {map(messages, (message, index) => buildMessage(message, index))}
    </div>
)

MessagesBoxComponent.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    setMessagesBoxRef: PropTypes.func,
}
export default MessagesBoxComponent

