import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import fontAwesome from 'font-awesome/css/font-awesome.css'

const Icon = ({ onClick, className, name }) => (
    <i className={classNames(fontAwesome.fa, fontAwesome[name], className)} onClick={onClick} />
)

Icon.displayName = 'Icon'
Icon.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default Icon
