import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { GamePhases } from '../../../../Dictionary'
import { ControlButton } from '../../Shared/Buttons'
import { Icon } from '../../Shared/Icon'

import styles from './GameControls.module.css'

const renderButton = (label, onClick) => (
    <ControlButton key={label} onClick={onClick}>{label}</ControlButton>
)

const GameControlsComponent = ({
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
        renderButton('kick', onKickPlayer),
        renderButton('ban', onBanPlayer),
    ]

    return (
        <div className={styles.gameControls}>
            <div className={styles.buttons}>
                <ControlButton onClick={onShowAffiliationClick}>
                    <span>
                        roles<Icon name={classNames('fa-fw', isAffiliationHidden ? 'fa-angle-right' : 'fa-angle-left')} className={styles.menuArrowIcon} />
                    </span>
                </ControlButton>
                {isOwner && ownersButtons}
            </div>
        </div>
    )
}

GameControlsComponent.displayName = 'GameControlsComponent'
GameControlsComponent.propTypes = {
    onStartGame: PropTypes.func,
    onKickPlayer: PropTypes.func,
    onBanPlayer: PropTypes.func,
    isOwner: PropTypes.bool,
    gamePhase: PropTypes.string,
    onShowAffiliationClick: PropTypes.func,
    isAffiliationHidden: PropTypes.bool,
}
export default GameControlsComponent
