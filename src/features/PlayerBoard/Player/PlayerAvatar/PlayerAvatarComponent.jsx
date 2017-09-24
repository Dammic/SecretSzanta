import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const PlayerAvatarComponent = ({
    liberalAvatar,
    facistAvatar,
    isDead,
    isPlayerWaitedFor,
}) => {
    const liberalAvatarPicture = require(`../../../../static/Avatar${liberalAvatar}.png`)
    const facistAvatarPicture = facistAvatar ? require(`../../../../static/Avatar${facistAvatar}.png`) : ''

    return (
        <div className={classNames('avatar-wrapper', { dead: isDead })}>
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
}
export default PlayerAvatarComponent
