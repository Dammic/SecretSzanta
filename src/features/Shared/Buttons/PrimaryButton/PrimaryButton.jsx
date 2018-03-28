import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '..'

import styles from './PrimaryButton.css'

class PrimaryButton extends PureComponent {
    render() {
        const { onClick, className, children } = this.props
        return (
            <Button
                onClick={onClick}
                className={classNames(styles.primary, className)}
            >
                {children}
            </Button>
        )
    }
}

PrimaryButton.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default PrimaryButton
