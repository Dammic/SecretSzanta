import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames/bind'
import { Icon } from '../Shared/Icon'

import { styles } from './Notifications.css'

export default class NotificationPanel extends PureComponent {
    static propTypes = {
        deleteNotification: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
        isError: PropTypes.bool,
        message: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
    }

    handleClose = () => {
        this.props.deleteNotification(this.props.id)
    }

    render() {
        const { isError, message } = this.props
        return (
            <div className={classNames(styles.notificationPanel, { [styles.error]: isError })}>
                {message}
                <Icon name="fa-times" onClick={this.handleClose} className={styles.exit} />
            </div>
        )
    }
}

