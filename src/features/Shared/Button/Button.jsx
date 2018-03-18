import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './Button.css'

export const Button = ({ label, onClick, className }) => {
    return (
        <div
            className={classNames(styles.fabulousButton, styles.linedThick, className)}
            onClick={onClick}
            role="button"
            tabIndex="0"
        >
            {label}
        </div>
    )
}

Button.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
}
