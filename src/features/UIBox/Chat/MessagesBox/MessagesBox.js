'use strict'
import React from 'react'
import MessagesBoxComponent from './MessagesBoxComponent'
import { connect } from 'react-redux'

export class MessagesBox extends React.PureComponent {

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

export default connect(mapStateToProps)(MessagesBox)
