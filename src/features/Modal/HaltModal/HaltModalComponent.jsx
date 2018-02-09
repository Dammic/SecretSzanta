import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../Shared/Button'

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
        <Button
            key={label}
            className="owner-button"
            label={label}
            onClick={onClick}
        />
    )

    return (
        <div className="halt-body">
            <i className="fa fa-pause" aria-hidden="true" />
            <span className="info">{pauseGameReason}</span>
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
