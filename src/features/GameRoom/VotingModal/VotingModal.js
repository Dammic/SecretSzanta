'use strict'
import React from 'react'
import VotingModalComponent from './VotingModalComponent'
import {SocketEvents} from '../../../../Dictionary'

export default class VotingModal extends React.PureComponent {

    onYesVote = () => {
        const { onHide, socket } = this.props
        socket.emit(SocketEvents.CLIENT_VOTE, { value: true })
        onHide()
    }

    onNoVote = () => {
        const { onHide, socket } = this.props
        socket.emit(SocketEvents.CLIENT_VOTE, { value: false })
        onHide()
    }

    render () {
        const {showModal, president, chancellorCandidate} = this.props
        return (
            <VotingModalComponent
                showModal={showModal}
                onYesVote={this.onYesVote}
                onNoVote={this.onNoVote}
                president={president}
                chancellorCandidate={chancellorCandidate} />
        )
    }
}
