'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const VotingModalComponent = ({
    showModal,
    onYesVote,
    onNoVote,
    presidentName,
    chancellorCandidate
}) => {
    return (
        <Modal customClass="voting-modal" show={showModal} clickOutside={false} isCloseButton={false}>
            <div>
                <div>President: {presidentName}</div>
                <div>Chancellor candidate: {chancellorCandidate}</div>
                <span>My name is jeff</span>
                <button onClick={onYesVote}>YAS!</button>
                <button onClick={onNoVote}>No!</button>
            </div>
        </Modal>
    )
}

export default VotingModalComponent
