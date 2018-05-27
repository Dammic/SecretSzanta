import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Icon = ({ onClick, className, name }) => {
    return (
        <i className={classNames('fa', name, className)} onClick={onClick} />
    )
}

Icon.propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default Icon
