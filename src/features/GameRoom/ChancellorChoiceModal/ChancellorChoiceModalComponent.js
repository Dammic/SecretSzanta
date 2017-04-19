'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const ChancellorChoiceModalComponent = ({
    showModal,
    chancellorsChoices,
    onChancellorChoice
}) => {
    return (
        <Modal show={showModal} clickOutside={false} isCloseButton={false}>
            <ul onClick={onChancellorChoice}>
                {chancellorsChoices.map((choice) => {
                    return <div key={choice} data-playername={choice}>{choice}</div>
                })}
            </ul>
        </Modal>
    )
}

export default ChancellorChoiceModalComponent
