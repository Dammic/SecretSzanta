import React from 'react'
import { isUndefined } from 'lodash'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture,
    voteBubbleStyle,
    voteValue,
}) => {
    return (
        <div className="player">
            <div>{playerName}</div>
            {!isUndefined(voteValue) && <div className={voteBubbleStyle}>{voteValue}</div>}
            <img className="portrait" src={avatar} alt="Player image" />
            {rolePicture && <img className="role" src={rolePicture} alt="" />}
        </div>
    )
}

export default PlayerComponent
