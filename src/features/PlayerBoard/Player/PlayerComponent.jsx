import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined } from 'lodash'

const PlayerComponent = ({
    playerName,
    avatar,
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
                <div className={classNames('avatar-wrapper', { dead: isDead })}>
                    {isPlayerWaitedFor && <i className="fa fa-clock-o selecting-wait-icon" aria-hidden="true" />}
                    <img className="portrait" src={avatar} alt="Player avatar" />
                </div>
                {rolePicture && <img className="role" src={rolePicture} alt="" />}
            </div>
        </div>
    )
}

PlayerComponent.propTypes = {
    playerName: PropTypes.string,
    avatar: PropTypes.string,
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
