import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './EllipsisText.css'

class EllipsisText extends PureComponent {
    render() {
        const { onClick, className, children } = this.props
        return (
            <span className={classNames(styles.ellipsis, className)} onClick={onClick}>{children}</span>
        )
    }
}

EllipsisText.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default EllipsisText
