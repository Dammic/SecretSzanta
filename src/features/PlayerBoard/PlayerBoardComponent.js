import React from 'react'
import PropTypes from 'prop-types'
import { times, map } from 'lodash'
import { PlayerDirection } from '../../../Dictionary'
import Player from './Player/Player'

const PlayerBoardComponent = ({
    playersLeft = [],
    playersMiddle = [],
    playersRight = [],
    policiesLiberalCount = 0,
    policiesFacistCount = 0,
}) => {
    const renderPolicies = (count, cardType) => {
        const result = []
        const cardPicture = (cardType === 'liberal') ? require('../../static/liberalcard.png') : require('../../static/facistcard.png')

        times(count, (index) => {
            result.push(<img key={`${cardType}-card-${index}`} src={cardPicture} alt="Policy" />)
        })

        return result
    }

    return (
        <div className="player-board">
            <div className="players-container">
                {map(playersLeft, player =>
                    <Player
                        key={player.playerName}
                        player={player}
                        direction={PlayerDirection.PLAYER_DIRECTION_LEFT}
                    />,
                 )}
            </div>

            <div className="central-part">
                <div className="players-container-middle">
                    {map(playersMiddle, player =>
                        <Player
                            key={player.playerName}
                            player={player}
                            direction={PlayerDirection.PLAYER_DIRECTION_UP}
                        />,
                    )}
                </div>

                <div className="policy">
                    <img src={require('../../static/liberalpolicies.png')} />
                    <div className="policy-card-liberal">
                        {renderPolicies(policiesLiberalCount, 'liberal')}
                    </div>
                </div>

                <div className="policy">
                    <img src={require('../../static/facistpolicies3.png')} />
                    <div className="policy-card-fascist">
                        {renderPolicies(policiesFacistCount, 'facist')}
                    </div>
                </div>
            </div>

            <div className="players-container">
                {map(playersRight, player =>
                    <Player
                        key={player.playerName}
                        player={player}
                        direction={PlayerDirection.PLAYER_DIRECTION_RIGHT}
                    />,
                )}
            </div>
        </div>
    )
}

PlayerBoardComponent.propTypes = {
    playersLeft: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    playersRight: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    playersMiddle: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    policiesLiberalCount: PropTypes.number,
    policiesFacistCount: PropTypes.number,
}
export default PlayerBoardComponent
