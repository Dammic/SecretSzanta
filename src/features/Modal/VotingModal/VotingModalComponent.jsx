import React from 'react'
import PropTypes from 'prop-types'
import { PlayerRole } from '../../../../Dictionary'
import { Button } from '../../Shared/Button/Button'
import { getAvatar } from '../../../utils/avatarsHelper'
import PresidentRoleImage from '../../../static/President.png'
import ChancellorRoleImage from '../../../static/Chancellor.png'

const VotingModalComponent = ({
    onYesVote,
    onNoVote,
    president,
    chancellorCandidate,
}) => {
    const renderPlayer = (avatarNumber, role, playerName) => {
        return (
            <div className="voting-info-player">
                <img className="voting-info-avatar" src={getAvatar(`liberal-${avatarNumber}`)}></img>
                <img className="voting-info-role" src={(role === PlayerRole.ROLE_PRESIDENT ? PresidentRoleImage : ChancellorRoleImage)}></img>
                <span className="ellipsis">{playerName}</span>
            </div>
        )
    }
    if (!chancellorCandidate || !president) return null

    return (
        <div className="voting-modal">
            <div className="voting-info-container">
                {renderPlayer(president.avatarNumber, PlayerRole.ROLE_PRESIDENT, president.playerName)}
                <div className="choice-order-container">
                    <div><i className="fa fa-angle-double-right" aria-hidden="true" /></div>
                    <div>Nominates</div>
                </div>
                {renderPlayer(chancellorCandidate.avatarNumber, PlayerRole.ROLE_CHANCELLOR, chancellorCandidate.playerName)}
            </div>
            <div className="voting-intro">The president nominates <strong>{chancellorCandidate.playerName}</strong> for a new chancellor!</div>
            <div className="voting-intro">Do you agree?</div>
            <div className="voting-buttons-container">
                <Button onClick={onYesVote} label="Jaa!" />
                <Button onClick={onNoVote} label="Nein!" />
            </div>
        </div>
    )
}

VotingModalComponent.propTypes = {
    onYesVote: PropTypes.func.isRequired,
    onNoVote: PropTypes.func.isRequired,
    president: PropTypes.shape({
        avatarNumber: PropTypes.number.isRequired,
        playerName: PropTypes.string.isRequired,
    }),
    chancellorCandidate: PropTypes.shape({
        avatarNumber: PropTypes.number.isRequired,
        playerName: PropTypes.string.isRequired,
    }),
}

export default VotingModalComponent
