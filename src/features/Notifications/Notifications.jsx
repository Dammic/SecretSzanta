import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { map, takeRight, reverse } from 'lodash'
import NotificationPanel from './NotificationPanel'
import NotificationsComponent from './NotificationsComponent'
import { MessagesTypes } from '../../../Dictionary'
import * as notificationsActions from '../../ducks/notificationsDuck'

export class Notifications extends React.PureComponent {
    static propTypes = {
        notifications: PropTypes.arrayOf(PropTypes.object),
        notificationsActions: PropTypes.objectOf(PropTypes.func),
    }

    render() {
        const selectedNotifications = reverse(takeRight(this.props.notifications, 3))

        return (
            <NotificationsComponent 
                notifications={selectedNotifications}
                deleteNotification={this.props.notificationsActions.deleteNotification}
            />
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
