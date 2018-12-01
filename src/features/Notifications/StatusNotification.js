import React from 'react'
import classNames from 'classnames/bind'
import { markupMessage, replaceKeysWithComponent } from './utils'
import styles from './Notifications.css'

export class StatusNotification extends React.PureComponent {
    render() {
        const { message, values } = this.props

        return (
            <div className={classNames(styles.notificationPanel, styles.status)} >
                {markupMessage(message, replaceKeysWithComponent(values))}
            </div>
        )
    }
}
