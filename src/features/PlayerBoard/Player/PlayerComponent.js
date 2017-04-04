'use strict'
import React from 'react'

const PlayerComponent = (
        playerName,
        picture
) => {
    return (                
            <div className="player">
                <div>{playerName}</div>
                <img className="portrait" src={picture} alt="Player image" />    
            </div>
           )
}

export default PlayerComponent
