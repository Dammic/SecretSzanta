import React from 'react'
import PropTypes from 'prop-types'
import { Button as ButtonComponent } from '../../Shared/Button'

const HaltModalComponent = ({
    hasGameEnded,
    isOwner,
    ownerName,
    onResumeGame,
    onInvitePlayers,
    onEndGame,
}) => {
    const information = hasGameEnded ? 'The game has ended!' : `The owner ${ownerName} has paused the game.`
    const Button = (label, onClick) => <ButtonComponent key={label} label={label} onClick={onClick} />

    return (
        <div className="halt-body">
            <i className="fa fa-pause" aria-hidden="true" />
            <span className="info">{information}</span>
            {isOwner && [
                Button('Resume game', onResumeGame),
                Button('Invite players', onInvitePlayers),
                Button('End game', onEndGame),
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
