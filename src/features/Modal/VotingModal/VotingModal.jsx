import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { find } from 'lodash'
import VotingModalComponent from './VotingModalComponent'
import { SocketEvents, PlayerRole } from '../../../../Dictionary'
import { socket } from '../../../utils/SocketHandler'

export class VotingModal extends React.PureComponent {
    onYesVote = () => {
        socket.emit(SocketEvents.CLIENT_VOTE, { value: true })
        this.props.closeModal()
    }

    onNoVote = () => {
        socket.emit(SocketEvents.CLIENT_VOTE, { value: false })
        this.props.closeModal()
    }

    render() {
        const chancellorCandidate = this.props.playersDict[this.props.data.chancellorCandidate]
        const president = find(this.props.playersDict, { role: PlayerRole.ROLE_PRESIDENT })
        return (
            <VotingModalComponent
                onYesVote={this.onYesVote}
                onNoVote={this.onNoVote}
                president={president}
                chancellorCandidate={chancellorCandidate}
            />
        )
    }
}

const mapStateToProps = ({ room: { playersDict, isVotingModalShown } }) => {
    return {
        playersDict,
        isVotingModalShown,
    }
}
export default connect(mapStateToProps)(VotingModal)
