import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class CurtainWrapper extends PureComponent {
    render() {
        const { isHidden, customClass } = this.props
        return (
            <div className={classNames('curtain', customClass)}>
                <div className="curtain__wrapper">
                    <div className={classNames('curtain__panel curtain__panel--left', { hidden: isHidden })}>

                    </div>

                    <div className="curtain__prize">
                    </div>

                    <div className={classNames('curtain__panel curtain__panel--right', { hidden: isHidden })}>

                    </div>
                </div>
            </div>
        )
    }
}

export default CurtainWrapper
