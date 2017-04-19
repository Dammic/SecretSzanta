'use strict'
import React from 'react'
import VotingModalComponent from './VotingModalComponent'
import {CLIENT_VOTE} from '../../../const/SocketEvents'

export default class VotingModal extends React.PureComponent {

    onYesVote = () => {
        const { onHide, socket } = this.props;
        socket.emit(CLIENT_VOTE, { value: true })
        onHide()
    }

    onNoVote = () => {
        const { onHide, socket } = this.props;
        socket.emit(CLIENT_VOTE, { value: false })
        onHide()
    }

    render () {
        const {showModal, presidentName, chancellorCandidate} = this.props
        return(
            <VotingModalComponent
                showModal={showModal}
                onYesVote={this.onYesVote}
                onNoVote={this.onNoVote}
                presidentName={presidentName}
                chancellorCandidate={chancellorCandidate} />
        )
    }
}
