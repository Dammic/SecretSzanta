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

            <div className="bubble"> 
                <div className="bubble-triangle">
                </div>
                <div className="bubble-message">
                </div>
            </div>

            <img className="portrait" src={avatar} alt="Player image" />    
            <img className="role" src={rolePicture} alt="" />
        </div>
    )
}

export default PlayerComponent
