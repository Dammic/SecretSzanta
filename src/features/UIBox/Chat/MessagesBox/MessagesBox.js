'use strict'
import React from 'react'
import MessagesBoxComponent from './MessagesBoxComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {addMessage} from '../../../../ducks/chatDuck'
import {SocketEvents} from '../../../../../Dictionary'
import {socket} from '../../../../utils/socket'

export class MessagesBox extends React.PureComponent {
    componentDidMount () {
        const {actions} = this.props

        socket.on(SocketEvents.CLIENT_JOIN_ROOM, ({timestamp, playerName}) => actions.addMessage(timestamp, `${playerName} has joined the room!`))
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, ({timestamp, playerName}) => actions.addMessage(timestamp, `${playerName} has left the room!`))
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, ({timestamp, content, author}) => actions.addMessage(timestamp, content, author))
    }

    componentDidUpdate() {
        this.scrollToBottomOfMessages()
    }

    setMessagesEndRef = (ref) => {this.messagesEndRef = ref}
    scrollToBottomOfMessages = () => {
        if(this.messagesEndRef) this.messagesEndRef.scrollIntoView()
    }

    render () {
        return (
            <MessagesBoxComponent
                messages={this.props.messages}
                setMessagesEndRef={this.setMessagesEndRef} />
        )
    }
}

const mapStateToProps = ({chat}) => {
    return {
        messages: chat.messages,
        scrollHeight: chat.scrollHeight
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({addMessage}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesBox)
