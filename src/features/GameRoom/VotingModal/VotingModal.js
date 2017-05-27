'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import VotingModalComponent from './VotingModalComponent'
import {SocketEvents} from '../../../../Dictionary'
import {socket} from '../../../utils/socket'
import {toggleVotingModal} from '../../../ducks/roomDuck'

export class VotingModal extends React.PureComponent {

    onYesVote = () => {
        socket.emit(SocketEvents.CLIENT_VOTE, { value: true })
        this.props.roomActions.toggleVotingModal(false)
    }

    onNoVote = () => {
        socket.emit(SocketEvents.CLIENT_VOTE, { value: false })
        this.props.roomActions.toggleVotingModal(false)
    }

    render () {
        return (
            <VotingModalComponent
                showModal={this.props.isVotingModalShown}
                onYesVote={this.onYesVote}
                onNoVote={this.onNoVote}
                president={this.props.president}
                chancellorCandidate={this.props.chancellorCandidate} />
        )
    }
}

const mapStateToProps = ({room}) => {
    return {
        president: room.president,
        chancellorCandidate: room.chancellorCandidate,
        isVotingModalShown: room.isVotingModalShown
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({toggleVotingModal}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VotingModal)