import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HaltModalComponent from './HaltModalComponent'
import { resumeGame, openInvitePlayersScreen, endGame } from '../../../gameLogic/ownerActions'

class HaltModal extends PureComponent {
    static propTypes = {
        hasGameEnded: PropTypes.bool,
        ownerName: PropTypes.string,
        playerName: PropTypes.string,
    }

    render() {
        const { ownerName, playerName, hasGameEnded } = this.props
        return (
            <HaltModalComponent
                ownerName={ownerName}
                hasGameEnded={hasGameEnded}
                isOwner={playerName === ownerName}
                onResumeGame={resumeGame}
                onInvitePlayers={openInvitePlayersScreen}
                onEndGame={endGame}
            />
        )
    }
}

const mapStateToProps = ({ room, user }) => {
    return {
        ownerName: room.ownerName,
        playerName: user.userName,
    }
}

export default connect(mapStateToProps)(HaltModal)
