'use strict'
import React from 'react'
import _ from 'lodash'
import Player from './Player/Player.js'

const PlayerBoardComponent = ({
    playersLeft = [],
    playersMiddle = [],
    playersRight = [],
    policiesLiberalCount = 0,
    policiesFacistCount = 0
}) => {

    const renderPolicies = (count, cardType) => {
        let result = []

        const cardPicture = (cardType === 'liberal') ? require('../../static/liberalcard.png') : require('../../static/facistcard.png')            

        _.times(count, () => {
            result.push(<img src={cardPicture} alt="Policy" />)
        })

        return result
    }
    
    return (
        <div className="player-board">

            <div className="players-container">
                {playersLeft.map( (player) => <Player player={player}/> )}
            </div>

            <div className="central-part">
                <div className="players-container-middle">
                    {playersMiddle.map( (player) => <Player player={player}/> )}
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
                {playersRight.map( (player) => <Player player={player}/> )}
            </div>

        </div>
    )
}

export default PlayerBoardComponent

