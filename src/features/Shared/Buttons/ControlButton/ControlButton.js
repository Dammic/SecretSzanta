import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '..'

import styles from './ControlButton.css'

const ControlButton = (props) => {
    const { className, children } = props
    return (
        <Button
            {...props}
            className={classNames(styles.control, className)}
        >
            <span className={styles.buttonText}>{children}</span>
        </Button>
    )
}

ControlButton.displayName = 'ControlButton'
ControlButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}

export default ControlButton
