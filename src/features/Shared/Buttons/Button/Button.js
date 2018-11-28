import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './Button.css'

const Button = (props) => {
    const { className, children } = props
    return (
        <div
            role="button"
            tabIndex="0"
            {...props}
            className={classNames(styles.btn, className)}
        >
            {children}
        </div>
    )
}

Button.displayName = 'Button'
Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    className: PropTypes.string,
}

export default Button
