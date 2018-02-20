import React from 'react'
import { PlayerRole } from '../../../../Dictionary'
import { Button } from '../../Shared/Button/Button'

const VotingModalComponent = ({
    onYesVote,
    onNoVote,
    president,
    chancellorCandidate,
}) => {
    const renderPlayer = (avatarNumber, role, playerName) => {
        return (
            <div className="voting-info-player">
                <img className="voting-info-avatar" src={require(`../../../static/Avatar${avatarNumber}.png`)}></img>
                <img className="voting-info-role" src={(role === PlayerRole.ROLE_PRESIDENT ? require('../../../static/President.png') : require('../../../static/Chancellor.png'))}></img>
                <span>{playerName}</span>
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
            <div className="voting-intro">Player <strong>{president.playerName}</strong> nominates player <strong>{chancellorCandidate.playerName}</strong> for a new chancellor!</div>
            <div className="voting-intro">Do you agree?</div>
            <div className="voting-buttons-container">
                <Button onClick={onYesVote} label="Jaa!" />
                <Button onClick={onNoVote} label="Nein!" />
            </div>
        </div>
    )
}

export default VotingModalComponent
