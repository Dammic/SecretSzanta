import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '..'

import styles from './PrimaryButton.module.css'

const PrimaryButton = (props) => {
    const { className, children } = props
    return (
        <Button
            {...props}
            className={classNames(styles.primary, className)}
        >
            {children}
        </Button>
    )
}

PrimaryButton.displayName = 'PrimaryButton'
PrimaryButton.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    className: PropTypes.string,
}

export default PrimaryButton
