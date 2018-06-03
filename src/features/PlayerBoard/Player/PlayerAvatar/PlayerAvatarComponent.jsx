import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../../utils/avatarsHelper'
import { Icon } from '../../../Shared/Icon'

import styles from './PlayerAvatar.css'

const PlayerAvatarComponent = ({
    liberalAvatar,
    facistAvatar,
    isDead,
    isPlayerWaitedFor,
    isOwner,
    className,
}) => {
    const liberalAvatarPicture = getAvatar(`liberal-${liberalAvatar}`)
    const facistAvatarPicture = getAvatar(`fascist-${facistAvatar}`)

    return (
        <div className={classNames(styles.avatarWrapper, className, { [styles.dead]: isDead })}>
            {isOwner && <Icon name="fa-bolt" className={styles.ownerIcon} />}
            {isPlayerWaitedFor && <Icon name="fa-clock-o" className={styles.selectingWaitIcon} />}
            {facistAvatar && <img className={classNames(styles.portrait, styles.facistPortrait)} src={facistAvatarPicture} alt="Player facist avatar" />}
            <img className={styles.portrait} src={liberalAvatarPicture} alt="Player liberal avatar" />
        </div>
    )
}

PlayerAvatarComponent.propTypes = {
    liberalAvatar: PropTypes.number,
    facistAvatar: PropTypes.number,
    isDead: PropTypes.bool,
    isPlayerWaitedFor: PropTypes.bool,
    isOwner: PropTypes.bool,
    className: PropTypes.string,
}
export default PlayerAvatarComponent
