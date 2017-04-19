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
            <div onClick={onChancellorChoice}>
                {chancellorsChoices.map((choice) => {
                    return <a key={choice} name={choice}>{choice}</a>
                })}
            </div>
        </Modal>
    )
}

export default ChancellorChoiceModalComponent
