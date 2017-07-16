'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { find } from 'lodash'
import VotingModalComponent from './VotingModalComponent'
import { SocketEvents, PlayerRole } from '../../../../Dictionary'
import { socket } from '../../../utils/socket'
import { toggleVotingModal } from '../../../ducks/roomDuck'

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
        const chancellorCandidate = this.props.playersDict[this.props.chancellorCandidate];
        const president = find(this.props.playersDict, { role: PlayerRole.ROLE_PRESIDENT })
        return (
            <VotingModalComponent
                showModal={this.props.isVotingModalShown}
                onYesVote={this.onYesVote}
                onNoVote={this.onNoVote}
                president={president}
                chancellorCandidate={chancellorCandidate} />
        )
    }
}

const mapStateToProps = ({room}) => {
    return {
        playersDict: room.playersDict,
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
