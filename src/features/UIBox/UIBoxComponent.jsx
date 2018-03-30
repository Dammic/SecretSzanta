import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications, GamePhases } from '../../../Dictionary'
import { Button } from '../Shared/Buttons'
import { Icon } from '../Shared/Icon'
import PlayerRoleComponent from '../PlayerBoard/Player/PlayerRole/PlayerRoleComponent'

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
        ? 'facist'
        : 'liberal'
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
        <div className="ui-box">
            <div className="game-controls">
                <div className="buttons">
                    <Button onClick={onShowAffiliationClick}>
                        roles<Icon name={classNames('fa-fw', isAffiliationHidden ? 'fa-angle-right' : 'fa-angle-left')} />
                    </Button>
                    {isOwner && ownersButtons}
                </div>
            </div>
            <div className={classNames('submenu', { hidden: isAffiliationHidden })}>
                <div className="affiliation-cards">
                    <span className={classNames('card', affiliationClassName)} />
                    <span className="card">
                        {getPlayerCard()}
                    </span>
                </div>
                <div className="role-wrapper">
                    <PlayerRoleComponent role={role} />
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
