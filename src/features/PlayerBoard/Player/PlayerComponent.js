'use strict'
import React from 'react'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture,
    voteBubbleStyle,
    voteBubbleInfo
}) => {
    return (                
        <div className="player">
            <div>{playerName}</div>
            {voteBubbleInfo && <div className={voteBubbleStyle}>{voteBubbleInfo.voteValue}</div>}
            <img className="portrait" src={avatar} alt="Player image" />
            {rolePicture && <img className="role" src={rolePicture} alt="" />}
        </div>
    )
}

export default PlayerComponent
