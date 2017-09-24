import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined } from 'lodash'
import PlayerAvatarComponent from './PlayerAvatar/PlayerAvatarComponent'
import PlayerRoleComponent from './PlayerRole/PlayerRoleComponent'

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
}) => {
    return (
        <div className="player">
            <div
                className={classNames('player-wrapper', { selectable: isSelectable, blurred: isChoiceModeVisible && !isSelectable })}
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
}
export default PlayerComponent
