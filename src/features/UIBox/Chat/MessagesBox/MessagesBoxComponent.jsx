import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import classNames from 'classnames/bind'

import styles from './MessagesBox.css'

const MessagesBoxComponent = ({
    messages = [],
    setMessagesBoxRef,
}) => {
    const buildMessage = (message, index) => {
        const { time, author, content } = message
        return (
            <div key={index} className={classNames(styles.message, { [styles.serverMessage]: !author })}>
                [{time}]{author ? ` ${author}: ` : ':'} {content}
            </div>
        )
    }

    return (
        <div className={styles.messagesBox} ref={setMessagesBoxRef}>
            {map(messages, (message, index) => buildMessage(message, index))}
        </div>
    )
}

MessagesBoxComponent.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    setMessagesBoxRef: PropTypes.func,
}
export default MessagesBoxComponent

