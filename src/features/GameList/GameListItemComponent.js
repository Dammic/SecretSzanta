'use strict'
import React from 'react'

const GameListItemComponent = ({
    roomID,
    roomName,
    playerCount,
    onClick
}) => {
    return (
        <td key={roomName} className="game-list-element">
            <div className="game-element-container">
                <div className="room-name">
                    <div>{roomName}</div>
                </div>
                <div className="join-button-area">
                    <button data-roomID={roomID} onClick={onClick}>JOIN</button>
                </div>
            </div>
        </td>
    )
}

export default GameListItemComponent