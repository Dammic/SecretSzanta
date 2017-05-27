'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const ChancellorChoiceModalComponent = ({
    showModal,
    potentialChancellorsChoices,
    onChancellorChoice
}) => {
    return (
        <Modal customClass="chancellor-choice-modal" show={showModal} clickOutside={false} isCloseButton={false}>
            <div className="choice-introduction">Choose the next chancellor:</div>
            <ul onClick={onChancellorChoice}>
                {potentialChancellorsChoices.map((choice) => {
                    const avatarPicture = require(`../../../static/Avatar${choice.avatarNumber}.png`)
                    return (
                        <div key={choice.playerName} className="chancellor-candidate-container" data-playername={choice.playerName}>
                            <img className="chancellor-candidate-photo" src={avatarPicture}></img>
                            <div>{choice.playerName}</div>
                        </div>
                    )
                })}
            </ul>
        </Modal>
    )
}

export default ChancellorChoiceModalComponent
