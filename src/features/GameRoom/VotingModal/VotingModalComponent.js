'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const VotingModalComponent = ({
    showModal,
    onYesVote,
    onNoVote,
    socket
}) => {
    return (
        <Modal show={showModal} clickOutside={false} isCloseButton={false}>
            <div>
                <div>President:</div>
                <div>Chancellor:</div>
                <span>My name is jeff</span>
                <button onClick={onYesVote}>YAS!</button>
                <button onClick={onNoVote}>No!</button>
            </div>
        </Modal>
    )
}

export default VotingModalComponent
