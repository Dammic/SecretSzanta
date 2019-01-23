import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MessagesBoxComponent from './MessagesBoxComponent'

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.scrollToBottomOfMessages()
        }
    }

    getSnapshotBeforeUpdate() {
        const { current } = this.messagesBoxRef
        if (current) {
            // visible height + pixel scrolled === total height
            // if user has chat scrolled to bottom in moment of receiving message
            // return true (which means for componentDidUpdate, scroll the chat!)
            if (current.offsetHeight + current.scrollTop === current.scrollHeight) {
                return true
            }
        }
        return false
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
