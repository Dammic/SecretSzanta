import React from 'react'
import classNames from 'classnames/bind'
import { markupMessage, replaceKeysWithComponent } from './utils'
import styles from './Notifications.module.css'

export const StatusNotification = ({ message, values }) => (
    <div className={classNames(styles.notificationPanel, styles.status)}>
        {markupMessage(message, replaceKeysWithComponent(values))}
    </div>
)
