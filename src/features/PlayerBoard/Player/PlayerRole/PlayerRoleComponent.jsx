import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PlayerRole } from '../../../../../Dictionary'

import styles from './PlayerRole.css'

const roleChancellorPicture = require('../../../../static/Chancellor.png')
const rolePresidentPicture = require('../../../../static/President.png')
const rolePreviousChancellorPicture = require('../../../../static/PreviousChancelor.png')
const rolePreviousPresidentPicture = require('../../../../static/PreviousPresident.png')

const PlayerRoleComponent = ({
    role,
    className,
}) => {
    let rolePicture
    switch (role) {
        case PlayerRole.ROLE_CHANCELLOR:
            rolePicture = roleChancellorPicture
            break
        case PlayerRole.ROLE_PRESIDENT:
            rolePicture = rolePresidentPicture
            break
        case PlayerRole.ROLE_PREVIOUS_CHANCELLOR:
            rolePicture = rolePreviousChancellorPicture
            break
        case PlayerRole.ROLE_PREVIOUS_PRESIDENT:
            rolePicture = rolePreviousPresidentPicture
            break
        default:
            rolePicture = ''
    }
    return (role ? <img className={classNames(styles.role, className)} src={rolePicture} alt="" /> : null)
}

PlayerRoleComponent.propTypes = {
    role: PropTypes.string,
    className: PropTypes.string,
}
export default PlayerRoleComponent
