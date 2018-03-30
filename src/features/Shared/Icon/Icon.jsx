import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Icon extends PureComponent {
    render() {
        const { onClick, className, name } = this.props
        return (
            <i className={classNames('fa', name, className)} onClick={onClick} />
        )
    }
}

Icon.propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default Icon
