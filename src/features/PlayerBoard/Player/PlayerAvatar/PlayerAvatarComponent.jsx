import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../../utils/avatarsHelper'

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
        <div className={classNames('avatar-wrapper', className, { dead: isDead })}>
            {isOwner && <i className="fa fa-bolt owner-icon" aria-hidden="true" />}
            {isPlayerWaitedFor && <i className="fa fa-clock-o selecting-wait-icon" aria-hidden="true" />}
            {facistAvatar && <img className="portrait facist-portrait" src={facistAvatarPicture} alt="Player facist avatar" />}
            <img className="portrait" src={liberalAvatarPicture} alt="Player liberal avatar" />
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
