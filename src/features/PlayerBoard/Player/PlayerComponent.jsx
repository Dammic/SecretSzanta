import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined } from 'lodash'
import PlayerAvatarComponent from './PlayerAvatar/PlayerAvatarComponent'

const PlayerComponent = ({
    playerName,
    liberalAvatar,
    facistAvatar,
    rolePicture,
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
                {rolePicture && <img className="role" src={rolePicture} alt="" />}
            </div>
        </div>
    )
}

PlayerComponent.propTypes = {
    playerName: PropTypes.string,
    liberalAvatar: PropTypes.number,
    facistAvatar: PropTypes.number,
    rolePicture: PropTypes.string,
    voteBubbleStyle: PropTypes.string,
    voteValue: PropTypes.string,
    isSelectable: PropTypes.bool,
    onChoiceModeSelect: PropTypes.func,
    isChoiceModeVisible: PropTypes.bool,
    isDead: PropTypes.bool,
    isPlayerWaitedFor: PropTypes.bool,
}
export default PlayerComponent
