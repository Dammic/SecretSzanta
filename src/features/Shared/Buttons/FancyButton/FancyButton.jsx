import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '..'

import styles from './FancyButton.css'

const FancyButton = (props) => {
    const { className, children } = props
    return (
        <Button
            {...props}
            className={classNames(styles.fabulousButton, styles.linedThick, className)}
        >
            {children}
        </Button>
    )
}

FancyButton.displayName = 'FancyButton'
FancyButton.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    className: PropTypes.string,
}

export default FancyButton
