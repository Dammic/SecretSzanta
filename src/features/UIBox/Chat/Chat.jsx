import React from 'react'
import PropTypes from 'prop-types'
import ChatComponent from './ChatComponent'

export default class Chat extends React.PureComponent {
    static propTypes = {
        // parent
        userName: PropTypes.string,
        className: PropTypes.string,
    }

    render() {
        const { userName, className } = this.props
        return (
            <ChatComponent userName={userName} className={className} />
        )
    }
}
