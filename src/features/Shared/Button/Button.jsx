import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const Button = ({ label, onClick, className }) => {
    const buttonClassNames = classNames('fabulous-button lined thick', className)
    return (
        <div
            className={buttonClassNames}
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
