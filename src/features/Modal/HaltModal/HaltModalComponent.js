import React from 'react'
import PropTypes from 'prop-types'
import { FancyButton } from '../../Shared/Buttons'
import { Icon } from '../../Shared/Icon'

import styles from './HaltModal.module.css'

const HaltModalComponent = ({
    hasGameEnded,
    isOwner,
    ownerName,
    onResumeGame,
    onInvitePlayers,
    onEndGame,
}) => {
    const pauseGameReason = hasGameEnded ? 'The game has ended!' : `The owner ${ownerName} has paused the game.`
    const renderButton = (label, onClick) => (
        <FancyButton
            key={label}
            className={styles.ownerButton}
            onClick={onClick}
        >
            {label}
        </FancyButton>
    )

    return (
        <div className={styles.haltBody}>
            <Icon name="fa-pause" />
            <span className={styles.info}>{pauseGameReason}</span>
            {isOwner && [
                renderButton('Resume game', onResumeGame),
                renderButton('Invite players', onInvitePlayers),
                renderButton('End game', onEndGame),
            ]}
        </div>
    )
}

HaltModalComponent.propTypes = {
    hasGameEnded: PropTypes.bool,
    isOwner: PropTypes.bool,
    ownerName: PropTypes.string,
    onResumeGame: PropTypes.func,
    onInvitePlayers: PropTypes.func,
    onEndGame: PropTypes.func,
}

export default HaltModalComponent
