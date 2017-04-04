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
            </div>
           )
}

export default PlayerComponent
