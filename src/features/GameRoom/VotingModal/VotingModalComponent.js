'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const VotingModalComponent = ({
    showModal,
    onYesVote,
    onNoVote,
    president,
    chancellorCandidate
}) => {

    const renderPlayer = (avatarNumber, role, playerName) => {
        return (
            <div className="voting-info-player">
                <img className="voting-info-avatar" src={require(`../../../static/Avatar${avatarNumber}.png`)}></img>
                <img className="voting-info-role" src={(role === 'president' ? require('../../../static/President.png') : require('../../../static/Chancellor.png'))}></img>
                <span>{playerName}</span>
            </div>
        )
    }

    if(!chancellorCandidate || !president) return null

    return (
        <Modal customClass="voting-modal" show={showModal} clickOutside={false} isCloseButton={false}>
            <div>
                <div className="voting-intro">Vote for your parliament!</div>
                <div className="voting-info-container">
                    {renderPlayer(president.avatarNumber, 'president', president.playerName)}
                    <div className="choice-order-container">
                        <div> => </div>
                        <div>Nominates</div>
                    </div>
                    {renderPlayer(chancellorCandidate.avatarNumber, 'chancellor', chancellorCandidate.playerName)}
                </div>
                <div className="voting-intro">Player <strong>{president.playerName}</strong> nominates player <strong>{chancellorCandidate.playerName}</strong> for a new chancellor!</div>
                <div className="voting-intro">Do you agree?</div>
                <div className="voting-buttons-container">
                    <div className="voting-button yes" onClick={onYesVote}>YAS!</div>
                    <div className="voting-button no" onClick={onNoVote}>No!</div>
                </div>
            </div>
        </Modal>
    )
}

export default VotingModalComponent
