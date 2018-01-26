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

    setMessagesBoxRef = (ref) => { this.messagesBoxRef = ref }

    scrollToBottomOfMessages = () => {
        if (this.messagesBoxRef) {
            this.messagesBoxRef.scrollTop = this.messagesBoxRef.scrollHeight
        }
    }

    render() {
        return (
            <MessagesBoxComponent
                messages={this.props.messages}
                setMessagesBoxRef={this.setMessagesBoxRef}
            />
        )
    }
}

const mapStateToProps = ({ chat }) => ({
    messages: chat.messages,
})

export default connect(mapStateToProps)(MessagesBox)
