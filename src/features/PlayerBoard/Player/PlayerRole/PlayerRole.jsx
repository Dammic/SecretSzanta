import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PlayerRole as PlayerRoleDict } from '../../../../../Dictionary'

import roleChancellorPicture from '../../../../static/Chancellor.png'
import rolePresidentPicture from '../../../../static/President.png'
import rolePreviousChancellorPicture from '../../../../static/PreviousChancelor.png'
import rolePreviousPresidentPicture from '../../../../static/PreviousPresident.png'

import styles from './PlayerRole.css'

const roleImagesMapping = {
    [PlayerRoleDict.ROLE_CHANCELLOR]: roleChancellorPicture,
    [PlayerRoleDict.ROLE_PRESIDENT]: rolePresidentPicture,
    [PlayerRoleDict.ROLE_PREVIOUS_CHANCELLOR]: rolePreviousChancellorPicture,
    [PlayerRoleDict.ROLE_PREVIOUS_PRESIDENT]: rolePreviousPresidentPicture,
}

const PlayerRole = ({ role, className }) => {
    if (!role || !roleImagesMapping[role]) {
        return null
    }

    const rolePicture = roleImagesMapping[role]
    return (
        <img className={classNames(styles.role, className)} src={rolePicture} alt={role} />
    )
}

PlayerRole.displayName = 'PlayerRole'
PlayerRole.propTypes = {
    role: PropTypes.string,
    className: PropTypes.string,
}
export default PlayerRole
