import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { noop, isUndefined } from 'lodash'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture,
    voteBubbleStyle,
    voteValue,
    isSelectable,
    onChoiceModeSelect,
}) => {
    return (
        <div className="player">
            <div className={classNames('player-wrapper', { selectable: isSelectable, blurred: !isSelectable })} data-playername={playerName} onClick={isSelectable ? onChoiceModeSelect : null}>
                <div>{playerName}</div>
                {!isUndefined(voteValue) && <div className={voteBubbleStyle}>{voteValue}</div>}
                <img className="portrait" src={avatar} alt="Player image" />
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
}
export default PlayerComponent
