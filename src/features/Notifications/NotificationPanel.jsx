import { React, PureComponent } from 'react'
import classNames from 'classnames/bind'

export default class NotificationPanel extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
        this.props.deleteInformation(this.props.id)
    }

    render() {
        const { isError, message } = this.props
        return (
            <div className={classNames('notification-panel', { error : isError })}>
                {message}
                <div className="notification-panel-exit" tabIndex="0" role="button" onClick={this.handleClose}>x</div>
            </div>
        )
    }
}

