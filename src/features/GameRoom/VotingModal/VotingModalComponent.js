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
    return (
        <Modal customClass="voting-modal" show={showModal} clickOutside={false} isCloseButton={false}>
            <div>
                {president && <div>President: {president.playerName}</div>}
                {chancellorCandidate && <div>Chancellor candidate: {chancellorCandidate.playerName}</div>}
                <button onClick={onYesVote}>YAS!</button>
                <button onClick={onNoVote}>No!</button>
            </div>
        </Modal>
    )
}

export default VotingModalComponent
