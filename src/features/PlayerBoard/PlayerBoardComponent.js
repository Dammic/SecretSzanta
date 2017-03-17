'use strict'
import React from 'react'

const PlayerBoardComponent = ({
left = [],
middle = [],
right = []
}) => {

    const renderPlayer = (player) => {
        console.info(player)
        return (
            <div className = "player">
                <img className = "portrait" src = {require('../../static/portrait1.png')} alt = "Player image"/>    
                <div>{player}</div>
            </div>
        )
    }
    
    return (
        <div className = "playerBoard">

            <div className = "playersContainer">
                {left.map( (player) => renderPlayer(player) )}
            </div>

            <div className = "playersContainerMiddle">
                {middle.map( (player) => renderPlayer(player) )}
            </div>

            <div className = "playersContainer">
                {right.map( (player) => renderPlayer(player) )}
            </div>

        </div>
    )
}

export default PlayerBoardComponent

