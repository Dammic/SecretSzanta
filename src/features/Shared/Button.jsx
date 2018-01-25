import React from 'react'
import PropTypes from 'prop-types'

export const Button = ({ label, onClick }) => {
    return (
        <div
            className="fabulous-button lined thick"
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
}
