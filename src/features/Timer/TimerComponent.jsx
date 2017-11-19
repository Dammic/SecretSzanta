import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TimerComponent = ({ secondsRemaining  }) => {
    return (
        <div className={classNames('timer', { visible: secondsRemaining })}>
            {secondsRemaining} Hello world
        </div>
    )
}

TimerComponent.propTypes = {
    secondsRemaining: PropTypes.number,
}

export default TimerComponent
