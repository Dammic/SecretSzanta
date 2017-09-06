import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const UIBoxComponent = ({
    onStartVote,
    onStartGame,
    onKillClick,
    onShowAffiliationClick,
    isAffiliationHidden,
}) => {
    return (
        <div className="ui-box">
            <div className="game-controls">
                <div className="buttons">
                    <a className="btn" onClick={onStartGame}>start</a>
                    <a className="btn" onClick={onStartVote}>voting</a>
                    <a className="btn" onClick={onKillClick}>kill</a>
                </div>
                <div className="side-buttons">
                    <span onClick={onShowAffiliationClick}>hai</span>

                </div>
            </div>

            <div className={classNames('affiliation-cards', { hidden: isAffiliationHidden })}>
                hi

            </div>
        </div>
    )
}

UIBoxComponent.propTypes = {
    onStartVote: PropTypes.func,
    onStartGame: PropTypes.func,
    onKillClick: PropTypes.func,
}
export default UIBoxComponent
