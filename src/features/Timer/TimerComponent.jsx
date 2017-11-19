import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TimerComponent = ({ secondsRemaining, isVetoUnlocked, onVetoClick }) => {
    return (
        <div className={classNames('timer', { visible: secondsRemaining })}>
            <strong>{secondsRemaining}</strong>s remaining
            {isVetoUnlocked && <a role="button" tabIndex="0" className="btn veto" onClick={onVetoClick}>veto</a>}
        </div>
    )
}

TimerComponent.propTypes = {
    secondsRemaining: PropTypes.number,
    onVetoClick: PropTypes.func,
    isVetoUnlocked: PropTypes.bool,
}

export default TimerComponent
