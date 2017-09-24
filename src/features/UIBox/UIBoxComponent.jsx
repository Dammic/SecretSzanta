import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications } from '../../../Dictionary'

const UIBoxComponent = ({
    onStartVote,
    onStartGame,
    onKillClick,
    onShowAffiliationClick,
    isAffiliationHidden,
    affiliation,
    getPlayerCard,
}) => {
    const facistsKinds = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
    const affiliationClassName = (includes(facistsKinds, affiliation)
        ? 'facist'
        : 'liberal'
    )

    return (
        <div className="ui-box">
            <div className="game-controls">
                <div className="buttons">
                    <a className="btn" onClick={onShowAffiliationClick}>
                        roles<i className={classNames('fa fa-fw', isAffiliationHidden ? 'fa-angle-right' : 'fa-angle-left')} aria-hidden="true" />
                    </a>
                    <a className="btn" onClick={onStartGame}>start</a>
                    <a className="btn" onClick={onStartVote}>voting</a>
                    <a className="btn" onClick={onKillClick}>kill</a>
                </div>
            </div>
            <div className={classNames('submenu', { hidden: isAffiliationHidden })}>
                <div className="affiliation-cards">
                    <span className={classNames('card', affiliationClassName)} />
                    <span className="card">
                        {getPlayerCard()}
                    </span>
                </div>
            </div>
        </div>
    )
}

UIBoxComponent.propTypes = {
    onStartVote: PropTypes.func,
    onStartGame: PropTypes.func,
    onKillClick: PropTypes.func,
    affiliation: PropTypes.string,
    isAffiliationHidden: PropTypes.bool,
    onShowAffiliationClick: PropTypes.func,
    getPlayerCard: PropTypes.func,
}
export default UIBoxComponent
