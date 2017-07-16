import React from 'react'
import Modal from '../../Modal/Modal'
import PropTypes from 'prop-types'
import { map } from 'lodash'

const ChancellorChoiceModalComponent = ({
    showModal,
    potentialChancellorsChoices,
    onChancellorChoice,
}) => {
    return (
        <Modal customClass="chancellor-choice-modal" show={showModal} clickOutside={false} isCloseButton={false}>
            <div className="choice-introduction">Choose the next chancellor:</div>
            <ul onClick={onChancellorChoice}>
                {map(potentialChancellorsChoices, (choice) => {
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

ChancellorChoiceModalComponent.propTypes = {
    showModal: PropTypes.bool,
    potentialChancellorsChoices: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    onChancellorChoice: PropTypes.func,

}
export default ChancellorChoiceModalComponent
