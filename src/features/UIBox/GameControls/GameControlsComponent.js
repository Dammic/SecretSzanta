import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { GamePhases } from '../../../../Dictionary'
import { Button } from '../../Shared/Buttons'
import { Icon } from '../../Shared/Icon'

import styles from './GameControls.css'

const renderButton = (label, onClick) => (
    <Button key={label} onClick={onClick}>{label}</Button>
)

const GameControlsComponent = ({
    onStartVote,
    onStartGame,
    onKickPlayer,
    onBanPlayer,
    onShowAffiliationClick,
    isOwner,
    gamePhase,
    isAffiliationHidden,
}) => {
    const ownersButtons = [
        gamePhase === GamePhases.GAME_PHASE_NEW && renderButton('start', onStartGame),
        renderButton('voting', onStartVote),
        renderButton('kick', onKickPlayer),
        renderButton('ban', onBanPlayer),
    ]

    return (
        <div className={styles.gameControls}>
            <div className={styles.buttons}>
                <Button onClick={onShowAffiliationClick}>
                    <span>
                        roles<Icon name={classNames('fa-fw', isAffiliationHidden ? 'fa-angle-right' : 'fa-angle-left')} className={styles.menuArrowIcon} />
                    </span>
                </Button>
                {isOwner && ownersButtons}
            </div>
        </div>
    )
}

GameControlsComponent.displayName = 'GameControlsComponent'
GameControlsComponent.propTypes = {
    onStartVote: PropTypes.func,
    onStartGame: PropTypes.func,
    onKickPlayer: PropTypes.func,
    onBanPlayer: PropTypes.func,
    isOwner: PropTypes.bool,
    gamePhase: PropTypes.string,
    onShowAffiliationClick: PropTypes.func,
    isAffiliationHidden: PropTypes.bool,
}
export default GameControlsComponent
