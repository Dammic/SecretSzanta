import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ChatFormComponent from './ChatFormComponent'
import { SocketEvents } from '../../../../Dictionary'
import { socket } from '../../../utils/SocketHandler'

export class ChatForm extends React.PureComponent {
    static displayName = 'ChatForm'
    static propTypes = {
        // redux
        userName: PropTypes.string,
    }
    state = {
        typedMessage: '',
    }

    sendMessage = () => {
        if (this.state.typedMessage) {
            socket.emit(SocketEvents.CLIENT_SEND_MESSAGE, {
                author: this.props.userName,
                content: this.state.typedMessage,
            })
            this.setState({
                typedMessage: '',
            })
        }
    }

    handleFormKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.sendMessage()
        }
    }

    changeMessageText = (event) => {
        this.setState({ typedMessage: event.target.value })
    }

    render() {
        return (
            <ChatFormComponent
                sendMessage={this.sendMessage}
                typedMessage={this.state.typedMessage}
                handleFormKeyPress={this.handleFormKeyPress}
                changeMessageText={this.changeMessageText}
            />
        )
    }
}


const mapStateToProps = ({ user }) => ({
    userName: user.userName,
})

export default connect(mapStateToProps)(ChatForm)
