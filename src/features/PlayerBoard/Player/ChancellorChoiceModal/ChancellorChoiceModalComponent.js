'use strict'
import React from 'react'
import Modal from '../../../Modal/Modal'

const ChancellorChoiceModalComponent = ({
    showModal,
    chancellorsChoices,
    onHide,
    socket
}) => {
    console.info(showModal)
    return (
        <Modal show={showModal} clickOutside={false} isCloseButton={false}>
            <div>
                Did you know that my name is jeff?
            </div>
        </Modal>
    )
}

export default ChancellorChoiceModalComponent
