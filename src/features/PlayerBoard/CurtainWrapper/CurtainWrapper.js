import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './CurtainWrapper.css'

class CurtainWrapper extends PureComponent {
    static displayName = 'CurtainWrapper'
    static propTypes = {
        isHidden: PropTypes.bool,
        isFascist: PropTypes.bool,
    }

    render() {
        const { isHidden, isFascist } = this.props
        return (
            <div className={classNames(styles.curtain, { [styles.liberal]: !isFascist, [styles.fascist]: isFascist })}>
                <div className={styles.curtainWrapper}>
                    <div className={classNames(styles.curtainPanel, styles.left, { [styles.hidden]: isHidden })} />
                    <div className={classNames(styles.curtainPanel, styles.right, { [styles.hidden]: isHidden })} />
                </div>
            </div>
        )
    }
}

export default CurtainWrapper
