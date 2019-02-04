import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PlayerAvatar } from '../../Shared/PlayerAvatar'
import VoteBubble from './VoteBubble/VoteBubble'

import styles from './Player.css'

const PlayerComponent = ({
    playerName,
    bubbleDirection,
    liberalAvatar,
    facistAvatar,
    role,
    isSelectable,
    onChoiceModeSelect,
    isChoiceModeVisible,
    isDead,
    isPlayerWaitedFor,
    isOwner,
}) => (
    <div className={styles.player}>
        <div
            className={classNames(styles.playerWrapper, { [styles.selectable]: isSelectable, [styles.blurred]: isChoiceModeVisible && !isSelectable })}
            data-playername={playerName}
            onClick={isSelectable ? onChoiceModeSelect : null}
        >
            <div>{playerName}</div>
            <VoteBubble playerName={playerName} direction={bubbleDirection} />
            <PlayerAvatar
                liberalAvatar={liberalAvatar}
                fascistAvatar={facistAvatar}
                isDead={isDead}
                isPlayerWaitedFor={isPlayerWaitedFor}
                isOwner={isOwner}
                role={role}
            />
        </div>
    </div>
)

PlayerComponent.displayName = 'PlayerComponent'
PlayerComponent.propTypes = {
    playerName: PropTypes.string,
    liberalAvatar: PropTypes.number,
    facistAvatar: PropTypes.number,
    role: PropTypes.string,
    isSelectable: PropTypes.bool,
    onChoiceModeSelect: PropTypes.func,
    isChoiceModeVisible: PropTypes.bool,
    isDead: PropTypes.bool,
    isPlayerWaitedFor: PropTypes.bool,
    isOwner: PropTypes.bool,
    bubbleDirection: PropTypes.string,
}
export default PlayerComponent
