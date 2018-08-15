import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Icon = ({ onClick, className, name }) => (
    <i className={classNames('fa', name, className)} onClick={onClick} />
)

Icon.displayName = 'Icon'
Icon.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default Icon
