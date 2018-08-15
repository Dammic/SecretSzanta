import React from 'react'
import { map } from 'lodash'
import NotificationPanel from './NotificationPanel'

import styles from './Notifications.css'

const NotificationsComponent = ({ notifications, statusNotification, deleteNotification }) => (
    <div className={styles.notifications} >
        {statusNotification &&
            <NotificationPanel
                id={statusNotification.id}
                message={statusNotification.message}
                type={statusNotification.type}
            />
        }
        {map(notifications, info => (
            <NotificationPanel
                key={`panel-${info.id}`}
                id={info.id}
                message={info.message}
                type={info.type}
                deleteNotification={deleteNotification}
            />
        ))}
    </div>
)

export default NotificationsComponent
