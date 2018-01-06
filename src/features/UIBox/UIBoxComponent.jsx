import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications, GamePhases } from '../../../Dictionary'
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

    const Button = (label, onClick) => (
        <a key={`${label}`} role="button" tabIndex="0" className="btn" onClick={onClick}>{`${label}`}</a>
    )

    const ownersButtons = [
        gamePhase === GamePhases.GAME_PHASE_NEW && Button("start", onStartGame),
        Button("voting", onStartVote),
        Button("kick", onKickPlayer),
        Button("ban", onBanPlayer),
    ];
    return (
        <div className="ui-box">
            <div className="game-controls">
                <div className="buttons">
                    <a className="btn" onClick={onShowAffiliationClick}>
                        roles<i className={classNames('fa fa-fw', isAffiliationHidden ? 'fa-angle-right' : 'fa-angle-left')} aria-hidden="true" />
                    </a>
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
