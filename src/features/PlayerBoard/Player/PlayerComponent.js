'use strict'
import React from 'react'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture,
    bubbleStyle
}) => {
    return (                
        <div className="player">
            <div>{playerName}</div>

            <div className={bubbleStyle}>
            </div>

            <img className="portrait" src={avatar} alt="Player image" />    
            {rolePicture && <img className="role" src={rolePicture} alt="" />}
        </div>
    )
}

export default PlayerComponent
