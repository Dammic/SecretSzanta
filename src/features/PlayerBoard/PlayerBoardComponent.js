'use strict'
import React from 'react'

const PlayerBoardComponent = ({
    left = [],
    middle = [],
    right = []
}) => {

    const renderPlayer = (player) => {
        const {playerName, picture} = player
        console.info(player)
        return (
            <div className="player">
                <img className="portrait" src = {picture} alt="Player image"/>    
                <div>{playerName}</div>
            </div>
        )
    }
    
    return (
        <div className="player-board">

            <div className="players-container">
                {left.map( (player) => renderPlayer(player) )}
            </div>

            <div className="central-part">
                <div className="players-container-middle">
                    {middle.map( (player) => renderPlayer(player) )}
                </div>

                <div className="policy">
                   <img src = {require('../../static/cactus.jpg')} /> 
                </div>
                
                <div className="policy">
                   <img src = {require('../../static/cactus.jpg')} /> 
                </div>

            </div>

            <div className="players-container">
                {right.map( (player) => renderPlayer(player) )}
            </div>

        </div>
    )
}

export default PlayerBoardComponent

