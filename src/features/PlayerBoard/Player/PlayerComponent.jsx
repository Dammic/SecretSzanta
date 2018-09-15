import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PlayerAvatar from './PlayerAvatar/PlayerAvatar'
import PlayerRole from './PlayerRole/PlayerRole'
import VoteBubble from './VoteBubble/VoteBubble'

import styles from './Player.css'

const PlayerComponent = ({
    playerName,
    bubbleDirection,
    liberalAvatar,
    facistAvatar,
    role,
    onClick,
    isSelectable,
    isChoiceModeVisible,
    isDead,
    isWaitIconVisible,
    isOwner,
}) => (
    <div
        className={classNames(styles.player, { [styles.selectable]: isSelectable, [styles.blurred]: isChoiceModeVisible && !isSelectable })}
        data-playername={playerName}
        onClick={onClick}
    >
        <div>{playerName}</div>
        <VoteBubble playerName={playerName} direction={bubbleDirection} />
        <PlayerAvatar
            liberalAvatar={liberalAvatar}
            fascistAvatar={facistAvatar}
            isDead={isDead}
            isWaitIconVisible={isWaitIconVisible}
            isOwner={isOwner}
        />
        <PlayerRole role={role} />
    </div>
)

PlayerComponent.displayName = 'PlayerComponent'
PlayerComponent.propTypes = {
    playerName: PropTypes.string,
    liberalAvatar: PropTypes.number,
    facistAvatar: PropTypes.number,
    role: PropTypes.string,
    isSelectable: PropTypes.bool,
    onClick: PropTypes.func,
    isChoiceModeVisible: PropTypes.bool,
    isDead: PropTypes.bool,
    isWaitIconVisible: PropTypes.bool,
    isOwner: PropTypes.bool,
    bubbleDirection: PropTypes.string,
}
export default PlayerComponent
