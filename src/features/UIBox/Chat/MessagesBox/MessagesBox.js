'use strict'
import React from 'react'
import MessagesBoxComponent from './MessagesBoxComponent'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {dispatchAction} from '../../../../utils/utils'
import {scrollChat} from '../../../../ducks/chatDuck'
import {SocketEvents} from '../../../../../Dictionary'
import {socket} from '../../../../utils/socket'

export class MessagesBox extends React.PureComponent {
    componentWillMount () {
        this.messagesBoxRef = null
    }
    componentDidMount () {
        const {actions} = this.props

        socket.on(SocketEvents.CLIENT_JOIN_ROOM, (data) => actions.scrollChat(this.messagesBoxRef.scrollHeight))
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, (data) => actions.scrollChat(this.messagesBoxRef.scrollHeight))
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, (data) => actions.scrollChat(this.messagesBoxRef.scrollHeight))
    }

    setMessagesBoxRef (ref) {
        const {scrollHeight} = this.props
        this.messagesBoxRef = ref

        // scrolling to the bottom of messages list
        if(this.messagesBoxRef) this.messagesBoxRef.scrollTop = scrollHeight
    }

    render () {        
        const {messages, scrollHeight} = this.props
        return (
            <MessagesBoxComponent
                messages={messages}
                setMessagesBoxRef={this.setMessagesBoxRef.bind(this)} />
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
        actions: bindActionCreators({dispatchAction, scrollChat}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesBox)
