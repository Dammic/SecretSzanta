import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './Button.css'

class Button extends PureComponent {
    render() {
        const { onClick, className, children } = this.props
        return (
            <div
                className={classNames(styles.btn, className)}
                onClick={onClick}
                role="button"
                tabIndex="0"
            >
                {children}
            </div>
        )
    }
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default Button
