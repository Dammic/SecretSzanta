import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined } from 'lodash'
import PlayerAvatarComponent from './PlayerAvatar/PlayerAvatarComponent'
import PlayerRoleComponent from './PlayerRole/PlayerRoleComponent'

import styles from './Player.css'

const PlayerComponent = ({
    playerName,
    liberalAvatar,
    facistAvatar,
    role,
    voteBubbleStyle,
    voteValue,
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
                {!isUndefined(voteValue) && <div className={voteBubbleStyle}>{voteValue}</div>}
                <PlayerAvatarComponent
                    liberalAvatar={liberalAvatar}
                    facistAvatar={facistAvatar}
                    isDead={isDead}
                    isPlayerWaitedFor={isPlayerWaitedFor}
                    isOwner={isOwner}
                />
                <PlayerRoleComponent role={role} />
            </div>
        </div>
    )
}

PlayerComponent.propTypes = {
    playerName: PropTypes.string,
    liberalAvatar: PropTypes.number,
    facistAvatar: PropTypes.number,
    role: PropTypes.string,
    voteBubbleStyle: PropTypes.string,
    voteValue: PropTypes.string,
    isSelectable: PropTypes.bool,
    onChoiceModeSelect: PropTypes.func,
    isChoiceModeVisible: PropTypes.bool,
    isDead: PropTypes.bool,
    isPlayerWaitedFor: PropTypes.bool,
    isOwner: PropTypes.bool,
}
export default PlayerComponent
