import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications, GamePhases } from '../../../Dictionary'
import { Button } from '../Shared/Buttons'
import { Icon } from '../Shared/Icon'
import PlayerRoleComponent from '../PlayerBoard/Player/PlayerRole/PlayerRoleComponent'

import styles from './UIBox.css'

const UIBoxComponent = ({
    onStartVote,
    onStartGame,
    onKickPlayer,
    onBanPlayer,
    onShowAffiliationClick,
    isOwner,
    gamePhase,
    isAffiliationHidden,
    affiliation,
    getPlayerCard,
    role,
}) => {
    const facistsKinds = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
    const affiliationClassName = (includes(facistsKinds, affiliation)
        ? styles.facist
        : styles.liberal
    )

    const renderButton = (label, onClick) => (
        <Button key={`${label}`} onClick={onClick}>{label}</Button>
    )

    const ownersButtons = [
        gamePhase === GamePhases.GAME_PHASE_NEW && renderButton('start', onStartGame),
        renderButton('voting', onStartVote),
        renderButton('kick', onKickPlayer),
        renderButton('ban', onBanPlayer),
    ]
    return (
        <div className={styles.uiBox}>
            <div className={styles.gameControls}>
                <div className={styles.buttons}>
                    <Button onClick={onShowAffiliationClick}>
                        <span>
                            roles<Icon name={classNames('fa-fw', isAffiliationHidden ? 'fa-angle-right' : 'fa-angle-left')} />
                        </span>
                    </Button>
                    {isOwner && ownersButtons}
                </div>
            </div>
            <div className={classNames(styles.submenu, { [styles.hidden]: isAffiliationHidden })}>
                <div className={styles.affiliationCards}>
                    <span className={classNames(styles.card, affiliationClassName)} />
                    <span className={styles.card}>
                        {getPlayerCard()}
                    </span>
                </div>
                <div className={styles.roleWrapper}>
                    <PlayerRoleComponent role={role} className={styles.uiBoxRole} />
                </div>
            </div>
        </div>
    )
}

UIBoxComponent.propTypes = {
    onStartVote: PropTypes.func,
    onStartGame: PropTypes.func,
    onKickPlayer: PropTypes.func,
    onBanPlayer: PropTypes.func,
    isOwner: PropTypes.bool,
    gamePhase: PropTypes.string,
    affiliation: PropTypes.string,
    isAffiliationHidden: PropTypes.bool,
    onShowAffiliationClick: PropTypes.func,
    getPlayerCard: PropTypes.func,
    role: PropTypes.string,
}
export default UIBoxComponent
