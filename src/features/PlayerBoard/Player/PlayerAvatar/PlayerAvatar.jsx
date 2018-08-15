import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../../utils/avatarsHelper'
import { Icon } from '../../../Shared/Icon'

import styles from './PlayerAvatar.css'

const PlayerAvatar = ({
    liberalAvatar,
    fascistAvatar,
    isDead,
    isPlayerWaitedFor,
    isOwner,
    className,
}) => {
    const liberalAvatarPicture = getAvatar(`liberal-${liberalAvatar}`)
    const facistAvatarPicture = getAvatar(`fascist-${fascistAvatar}`)

    if (!liberalAvatarPicture) {
        return null
    }

    return (
        <div className={classNames(styles.avatarWrapper, className, { [styles.dead]: isDead })}>
            {isOwner && <Icon name="fa-bolt" className={styles.ownerIcon} />}
            {isPlayerWaitedFor && <Icon name="fa-clock-o" className={styles.selectingWaitIcon} />}
            {fascistAvatar && <img className={classNames(styles.portrait, styles.facistPortrait)} src={facistAvatarPicture} alt="Player facist avatar" />}
            <img className={styles.portrait} src={liberalAvatarPicture} alt="Player liberal avatar" />
        </div>
    )
}

PlayerAvatar.displayName = 'PlayerAvatar'
PlayerAvatar.propTypes = {
    liberalAvatar: PropTypes.number.isRequired,
    fascistAvatar: PropTypes.number,
    isDead: PropTypes.bool,
    isPlayerWaitedFor: PropTypes.bool,
    isOwner: PropTypes.bool,
    className: PropTypes.string,
}
export default PlayerAvatar
