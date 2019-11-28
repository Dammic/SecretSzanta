import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { takeRight, reverse } from 'lodash'
import NotificationsComponent from './NotificationsComponent'
import * as notificationsActions from '../../ducks/notificationsDuck'

export class Notifications extends React.PureComponent {
    static propTypes = {
        notifications: PropTypes.arrayOf(PropTypes.object),
        statusNotification: PropTypes.object,
        deleteNotification: PropTypes.func.isRequired,
    }

    render() {
        const { notifications, statusNotification, deleteNotification } = this.props
        const selectedNotifications = reverse(takeRight(notifications, 3))

        return (
            <NotificationsComponent
                notifications={selectedNotifications}
                {...{ statusNotification, deleteNotification }}
            />
        )
    }
}

const mapStateToProps = ({ notification }) => ({
    notifications: notification.notifications,
    statusNotification: notification.statusNotification,
})
const mapDispatchToProps = dispatch => (
    bindActionCreators(notificationsActions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
