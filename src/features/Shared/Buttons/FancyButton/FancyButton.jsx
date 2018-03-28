import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '..'

import styles from './FancyButton.css'

class FancyButton extends PureComponent {
    render() {
        const { onClick, className, children } = this.props
        return (
            <Button
                onClick={onClick}
                className={classNames(styles.fabulousButton, styles.linedThick, className)}
            >
                {children}
            </Button>
        )
    }
}

FancyButton.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default FancyButton
