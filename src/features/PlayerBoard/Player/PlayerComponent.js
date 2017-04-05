'use strict'
import React from 'react'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture
}) => {
    return (                
        <div className="player">
            <div>{playerName}</div>
            <img className="portrait" src={avatar} alt="Player image" />    
            <img className="role" src={rolePicture} alt="Players role" />
        </div>
    )
}

export default PlayerComponent
