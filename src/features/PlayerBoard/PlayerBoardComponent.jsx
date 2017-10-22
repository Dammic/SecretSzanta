import React from 'react'
import PropTypes from 'prop-types'
import { times, map } from 'lodash'
import { PlayerDirection } from '../../../Dictionary'
import Player from './Player/Player'
import classNames from 'classnames'

const PlayerBoardComponent = ({
    playersLeft = [],
    playersMiddle = [],
    playersRight = [],
    policiesLiberalCount = 0,
    policiesFacistCount = 0,
    trackerPosition,
    trackerMoved,
    isChoiceModeVisible,
    onChoiceModeSelect,
}) => {
    const renderPolicies = (count, cardType) => {
        const result = []
        const cardPicture = (cardType === 'liberal') ? require('../../static/liberalcard.png') : require('../../static/facistcard.png')

        times(count, (index) => {
            result.push(<img key={`${cardType}-card-${index}`} src={cardPicture} alt="Policy" />)
        })

        return result
    }

    const renderPlayers = (playersList, containerClass, direction) => {
        return (
            <div className={containerClass}>
                {map(playersList, player =>
                    <Player
                        key={player.playerName}
                        player={player}
                        direction={direction}
                        onChoiceModeSelect={onChoiceModeSelect}
                    />,
                )}
            </div>
        )
    }

    const trackerFromLeftStyle = { left: `${37 + trackerPosition * 8}%` }

    return (
        <div className="player-board">
            {isChoiceModeVisible && <div className="overlay choice-overlay" />}
            {renderPlayers(playersLeft, 'players-container', PlayerDirection.PLAYER_DIRECTION_LEFT)}
            <div className="central-part">
                {renderPlayers(playersMiddle, 'players-container-middle', PlayerDirection.PLAYER_DIRECTION_UP)}

                <div className={classNames('policy', { blurred: isChoiceModeVisible })} >
                    <img src={require('../../static/liberalpolicies.png')} />
                    <div className="policy-card-liberal">
                        {renderPolicies(policiesLiberalCount, 'liberal')}
                    </div>
                    <div className={classNames('tracker', { moving: trackerMoved })} style={trackerFromLeftStyle} />
                </div>

                <div className={classNames('policy', { blurred: isChoiceModeVisible })}>
                    <img src={require('../../static/facistpolicies3.png')} />
                    <div className="policy-card-fascist">
                        {renderPolicies(policiesFacistCount, 'facist')}
                    </div>
                </div>
            </div>

            {renderPlayers(playersRight, 'players-container', PlayerDirection.PLAYER_DIRECTION_RIGHT)}
        </div>
    )
}

PlayerBoardComponent.propTypes = {
    playersLeft: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    playersRight: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    playersMiddle: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    policiesLiberalCount: PropTypes.number,
    policiesFacistCount: PropTypes.number,
    trackerPosition: PropTypes.number,
    isChoiceModeVisible: PropTypes.bool,
    onChoiceModeSelect: PropTypes.func,
}
export default PlayerBoardComponent
