'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChatFormComponent from './ChatFormComponent'
import {SocketEvents} from '../../../../../Dictionary'
import {socket} from '../../../../utils/socket'

export class ChatForm extends React.PureComponent {

    componentWillMount () {
        this.state = {
            typedMessage: ''
        }
    }

    sendMessage () {
        const {typedMessage} = this.state
        const {userName} = this.props

        if (typedMessage) {
            socket.emit(SocketEvents.CLIENT_SEND_MESSAGE, {
                author: userName,
                content: typedMessage
            })
            this.setState({
                typedMessage: ''
            })
        }
    }

    handleFormKeyPress (event) {
        if (event.key === 'Enter') {
            this.sendMessage()
        }
    }

    changeMessageText (event) {
        this.setState({typedMessage: event.target.value})
    }

    render () {
        const {typedMessage} = this.state
        return (
            <ChatFormComponent
                sendMessage={this.sendMessage.bind(this)}
                typedMessage={typedMessage}
                handleFormKeyPress={this.handleFormKeyPress.bind(this)}
                changeMessageText={this.changeMessageText.bind(this)} />
        )
    }
}


const mapStateToProps = ({user}) => {
    return {
        userName: user.userName
    }
}

export default connect(mapStateToProps)(ChatForm)
