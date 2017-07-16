import React from 'react'
import PropTypes from 'prop-types'
import ChatComponent from './ChatComponent'

export default class Chat extends React.PureComponent {
    static propTypes = {
        // parent
        userName: PropTypes.string,
    }

    render() {
        const { userName } = this.props
        return (
            <ChatComponent userName={userName}/>
        )
    }
}
