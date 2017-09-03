import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames/bind'

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
            <div className={classNames('notification-panel', { error: isError })}>
                {message}
                <div className="notification-panel-exit" tabIndex="0" role="button" onClick={this.handleClose}>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
            </div>
        )
    }
}

