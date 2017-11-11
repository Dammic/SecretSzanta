import React from 'react'
import PropTypes from 'prop-types'

const GameListItemComponent = ({
    roomID,
    roomName,
    playerCount,
    onClick,
}) => {
    return (
        <div key={roomName} className="game-list-element">
            <div className="game-element-container">
                <div className="room-name">
                    <div>{roomName} |{playerCount}/9999</div>
                </div>
                <div className="join-button-area">
                    <button data-roomID={roomID} onClick={onClick}>JOIN</button>
                </div>
            </div>
        </div>
    )
}

GameListItemComponent.propTypes = {
    roomID: PropTypes.string,
    roomName: PropTypes.string,
    playerCount: PropTypes.number,
    onClick: PropTypes.func,
}

export default GameListItemComponent
