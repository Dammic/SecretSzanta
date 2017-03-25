'use strict'
import React from 'react'

const GameListItemComponent = ({
    roomID,
    roomName,
    playerCount,
    onClick
}) => {
    return (
        <li key={roomName} className="name">
            <div>{roomName}</div>
            <button data-roomID={roomID} onClick={onClick}>JOIN</button>
        </li>
    )
}

export default GameListItemComponent