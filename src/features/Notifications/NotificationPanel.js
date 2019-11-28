import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames/bind'
import { Icon } from '../Shared/Icon'
import { MessagesTypes } from '../../../Dictionary'

import styles from './Notifications.module.css'

export default class NotificationPanel extends PureComponent {
    static propTypes = {
        deleteNotification: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf([MessagesTypes.INFO, MessagesTypes.ERROR, MessagesTypes.STATUS]),
        message: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
    }

    handleClose = () => {
        this.props.deleteNotification(this.props.id)
    }

    render() {
        const { type, message, deleteNotification } = this.props
        return (
            <div
                className={classNames(styles.notificationPanel, {
                    [styles.info]: type === MessagesTypes.INFO,
                    [styles.error]: type === MessagesTypes.ERROR,
                    [styles.status]: type === MessagesTypes.STATUS,
                })}
            >
                {message}
                {deleteNotification && <Icon name="fa-times" onClick={this.handleClose} className={styles.exit} />}
            </div>
        )
    }
}

