import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications } from '../../../Dictionary'
import PlayerRoleComponent from '../PlayerBoard/Player/PlayerRole/PlayerRoleComponent'

const UIBoxComponent = ({
    onStartVote,
    onStartGame,
    onKickPlayer,
    onBanPlayer,
    onShowAffiliationClick,
    isOwner,
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

    const ownersButtons = [
        <a key="startGame" role="button" tabIndex="0" className="btn" onClick={onStartGame}>start</a>,
        <a key="startVote" role="button" tabIndex="0" className="btn" onClick={onStartVote}>voting</a>,
        <a key="kickPlayer" role="button" tabIndex="0" className="btn" onClick={onKickPlayer}>kick</a>, 
        <a key="banPlayer" role="button" tabIndex="0" className="btn" onClick={onBanPlayer}>ban</a>,
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
    affiliation: PropTypes.string,
    isAffiliationHidden: PropTypes.bool,
    onShowAffiliationClick: PropTypes.func,
    getPlayerCard: PropTypes.func,
    role: PropTypes.string,
}
export default UIBoxComponent
