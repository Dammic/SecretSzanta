'use strict'
import React from 'react'

const PlayerBoardComponent = ({
    playersLeft = [],
    playersMiddle = [],
    playersRight = [],
    policiesLiberalCount = 0,
    policiesFacistCount = 0
}) => {

    const renderPlayer = (player) => {
        const {playerName, picture} = player
        console.info(player)
        
        const random = Math.floor(Math.random() * 5 + 1)

        const pictureR = require(`../../static/Avatar${random}.png`)
        const rolePicture = require('../../static/Chancellor.png')
        return (
            <div className="player">
                <div>{playerName}</div>
                <img className="portrait" src={pictureR} alt="Player image" />    
            </div>
        )
    }

    const renderPolicies = (count, cardType) => {
        const result = []

        const cardPicture = (cardType === 'liberal') ? require('../../static/liberalcard.png') : require('../../static/facistcard.png')            

        _.times(count,
                () => result.push(
                    <img src={cardPicture} alt="Policy" />
                    )
            )
        return result
    }
    
    return (
        <div className="player-board">

            <div className="players-container">
                {playersLeft.map( (player) => renderPlayer(player) )}
            </div>

            <div className="central-part">
                <div className="players-container-middle">
                    {playersMiddle.map( (player) => renderPlayer(player) )}
                </div>

                <div className="policy">
                    <img src = {require('../../static/liberalpolicies.png')} /> 
                    <div className="policy-card-liberal">
                        {renderPolicies(policiesLiberalCount, 'liberal')}
                    </div>
                </div>
                
                <div className="policy">
                    <img src = {require('../../static/facistpolicies3.png')} /> 
                    <div className="policy-card-fascist">
                        {renderPolicies(policiesFacistCount, 'facist')}
                    </div>
                </div>

            </div>

            <div className="players-container">
                {playersRight.map( (player) => renderPlayer(player) )}
            </div>

        </div>
    )
}

export default PlayerBoardComponent

