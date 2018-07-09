import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined } from 'lodash'
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
    isSelectable,
    onChoiceModeSelect,
    isChoiceModeVisible,
    isDead,
    isPlayerWaitedFor,
    isOwner,
}) => {
    return (
        <div className={styles.player}>
            <div
                className={classNames(styles.playerWrapper, { [styles.selectable]: isSelectable, [styles.blurred]: isChoiceModeVisible && !isSelectable })}
                data-playername={playerName}
                onClick={isSelectable ? onChoiceModeSelect : null}
            >
                <div>{playerName}</div>
                <VoteBubble playerName={playerName} bubbleDirection={bubbleDirection} />
                <PlayerAvatar
                    liberalAvatar={liberalAvatar}
                    fascistAvatar={facistAvatar}
                    isDead={isDead}
                    isPlayerWaitedFor={isPlayerWaitedFor}
                    isOwner={isOwner}
                />
                <PlayerRole role={role} />
            </div>
        </div>
    )
}

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
