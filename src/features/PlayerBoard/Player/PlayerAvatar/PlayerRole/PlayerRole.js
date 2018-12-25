import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PlayerRole as PlayerRoleDict } from '../../../../../../Dictionary'

import styles from './PlayerRole.css'

const roleMapping = {
    [PlayerRoleDict.ROLE_CHANCELLOR]: 'Chancellor',
    [PlayerRoleDict.ROLE_PRESIDENT]: 'President',
    [PlayerRoleDict.ROLE_PREVIOUS_CHANCELLOR]: 'P. Chancellor',
    [PlayerRoleDict.ROLE_PREVIOUS_PRESIDENT]: 'P. President',
}

const PlayerRole = ({ role }) => {
    if (!role || !roleMapping[role]) {
        return null
    }

    const roleName = roleMapping[role]
    const ribbonNameClassNames = classNames(styles.roleName, {
        [styles.chancellor]: role === PlayerRoleDict.ROLE_CHANCELLOR,
    })

    return (
        <div className={styles.ribbon}>
            <span className={ribbonNameClassNames}>
                {roleName}
            </span>
        </div>
    )
}

PlayerRole.displayName = 'PlayerRole'
PlayerRole.propTypes = {
    role: PropTypes.string,
}

export { PlayerRole }
export default PlayerRole
