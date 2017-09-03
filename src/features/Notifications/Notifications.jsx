import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { map, takeRight, reverse } from 'lodash'
import NotificationPanel from './NotificationPanel'
import { MessagesTypes } from '../../../Dictionary'
import * as notificationsActions from '../../ducks/notificationsDuck'

export class Notifications extends React.PureComponent {
    static propTypes = {
        notifications: PropTypes.arrayOf(PropTypes.object),
        notificationsActions: PropTypes.objectOf(PropTypes.func),
    }
    render() {
        const panels = map(reverse(takeRight(this.props.notifications, 3)), (info) => {
            const isError = info.type === MessagesTypes.ERROR_NOTIFICATION

            return (
                <NotificationPanel
                    key={`panel-${info.id}`}
                    id={info.id}
                    message={info.message}
                    isError={isError}
                    deleteNotification={this.props.notificationsActions.deleteNotification}
                />
            )
        })

        return (
            <div className="notifications" >
                {panels}
            </div>
        )
    }
}

const mapStateToProps = ({ notification }) => ({
    notifications: notification.notifications,
})
const mapDispatchToProps = dispatch => ({
    notificationsActions: bindActionCreators(notificationsActions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
