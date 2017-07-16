import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MessagesBoxComponent from './MessagesBoxComponent'

export class MessagesBox extends React.PureComponent {
    static propTypes = {
        // redux
        messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    }

    componentDidUpdate() {
        this.scrollToBottomOfMessages()
    }

    setMessagesEndRef = (ref) => { this.messagesEndRef = ref }

    scrollToBottomOfMessages = () => {
        if (this.messagesEndRef) {
            this.messagesEndRef.scrollIntoView()
        }
    }

    render() {
        return (
            <MessagesBoxComponent
                messages={this.props.messages}
                setMessagesEndRef={this.setMessagesEndRef} />
        )
    }
}

const mapStateToProps = ({ chat }) => ({
    messages: chat.messages,
})

export default connect(mapStateToProps)(MessagesBox)
