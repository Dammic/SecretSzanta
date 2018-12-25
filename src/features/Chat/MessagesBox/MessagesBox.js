import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MessagesBoxComponent from './MessagesBoxComponent'

const MESSAGE_HEIGHT = 25

export class MessagesBox extends React.PureComponent {
    static displayName = 'MessagesBox'
    static propTypes = {
        // redux
        messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    }

    constructor() {
        super()
        this.messagesBoxRef = React.createRef()
    }

    componentDidUpdate() {
        const { current } = this.messagesBoxRef
        if (current) {
            // We calculate if the user has reached the end - MESSAGE_HEIGHT, because it happens in componentDidUpdate
            // and by this time, a new message must have been added to the box, so we need to subtract that
            if (current.scrollHeight - (current.offsetHeight + current.scrollTop) <= MESSAGE_HEIGHT) {
                this.scrollToBottomOfMessages()
            }
        }
    }

    scrollToBottomOfMessages = () => {
        const { current } = this.messagesBoxRef
        current.scrollTop = current.scrollHeight
    }

    render() {
        return (
            <MessagesBoxComponent
                messages={this.props.messages}
                ref={this.messagesBoxRef}
            />
        )
    }
}

const mapStateToProps = ({ chat }) => ({
    messages: chat.messages,
})

export default connect(mapStateToProps)(MessagesBox)
