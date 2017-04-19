'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const VotingModalComponent = ({
    showModal,
    onHide,
    socket
}) => {
    return (
        <Modal show={showModal} onHide={onHide} clickOutside={true}>
            <div>
                <span>My name is jeff</span>
                <button>YES</button>
                <button>NO</button>
            </div>
        </Modal>
    )
}

export default VotingModalComponent
