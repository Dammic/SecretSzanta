import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '../Shared/Buttons'

import styles from './Timer.module.css'

const TimerComponent = ({ secondsRemaining, isVetoUnlocked, onVetoClick }) => (
    <div className={classNames(styles.timer, { [styles.visible]: !!secondsRemaining })}>
        <strong>{secondsRemaining}</strong>s remaining
        {isVetoUnlocked && <Button className={styles.veto} onClick={onVetoClick}>veto</Button>}
    </div>
)

TimerComponent.displayName = 'TimerComponent'
TimerComponent.propTypes = {
    secondsRemaining: PropTypes.number,
    onVetoClick: PropTypes.func,
    isVetoUnlocked: PropTypes.bool,
}

export default TimerComponent
