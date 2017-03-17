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
            <button data-roomID={roomID} onClick={(event) => {event.persist(); onClick(event)}}>JOIN</button>
        </li>
    )
}

export default GameListItemComponent