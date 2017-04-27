'use strict'
import React from 'react'
import MessagesBoxComponent from './MessagesBoxComponent'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {CLIENT_SEND_MESSAGE, CLIENT_JOIN_ROOM, CLIENT_LEAVE_ROOM} from '../../../const/SocketEvents'
import {dispatchAction} from '../../../utils/utils'

export class MessagesBox extends React.PureComponent {
    componentWillMount () {
        this.messagesBoxRef = null
    }
    componentDidMount () {
        const {socket, actions} = this.props

        socket.on(CLIENT_JOIN_ROOM, (data) => actions.dispatchAction(CLIENT_JOIN_ROOM, {...data}, {scrollHeight: this.messagesBoxRef.scrollHeight}))
        socket.on(CLIENT_LEAVE_ROOM, (data) => actions.dispatchAction(CLIENT_LEAVE_ROOM, {...data}, {scrollHeight: this.messagesBoxRef.scrollHeight}))
        socket.on(CLIENT_SEND_MESSAGE, (data) => actions.dispatchAction(CLIENT_SEND_MESSAGE, {...data}, {scrollHeight: this.messagesBoxRef.scrollHeight}))
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
        actions: bindActionCreators({dispatchAction}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesBox)