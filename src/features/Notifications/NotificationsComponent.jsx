import React from 'react'
import { map } from 'lodash'
import NotificationPanel from './NotificationPanel'
import { MessagesTypes } from '../../../Dictionary.js'

import styles from './Notifications.css'

const NotificationsComponent = ({ notifications, deleteNotification }) => {
    const renderPanel = (info) => {
        const isError = info.type === MessagesTypes.ERROR

        return (
            <NotificationPanel
                key={`panel-${info.id}`}
                id={info.id}
                message={info.message}
                isError={isError}
                deleteNotification={deleteNotification}
            />
        )
    }

    return (
        <div className={styles.notifications} >
            {map(notifications, renderPanel)}
        </div>
    )
}

export default NotificationsComponent
