import React from 'react'
import { map } from 'lodash'
import NotificationPanel from './NotificationPanel'
import { MessagesTypes } from '../../../Dictionary.js'

const NotificationsComponent = ({ notifications, deleteNotification }) => {
    const renderPanel = (info) => {
        const isError = info.type === MessagesTypes.ERROR_NOTIFICATION

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
        <div className="notifications" >
            {map(notifications, renderPanel)}
        </div>
    )
}

export default NotificationsComponent