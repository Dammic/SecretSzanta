import React from 'react'
import { map } from 'lodash'
import NotificationPanel from './NotificationPanel'
import { StatusNotification } from './StatusNotification'

import styles from './Notifications.css'

const NotificationsComponent = ({ notifications, statusNotification, deleteNotification }) => (
    <div className={styles.notifications} >
        {statusNotification &&
            <StatusNotification
                id={statusNotification.id}
                message={statusNotification.message}
                values={statusNotification.values}
                type={statusNotification.type}
                additional={statusNotification.additional}
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
