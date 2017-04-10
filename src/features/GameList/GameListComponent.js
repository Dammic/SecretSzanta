'use strict'
import React from 'react'
import GameListItemComponent from './GameListItemComponent'
import TopNavbar from './TopNavbar/TopNavbar'

const GameListComponent = ({
    title,
    rooms,
    onClick,
    socket
}) => {
    return (
        <div className="main-page">
            <TopNavbar socket={socket}/>
            Hello {title}!
            <div className="game-list">
                {rooms.map((room) => {
                    return (
                        <GameListItemComponent
                            key={room.roomID}
                            roomID={room.roomID}
                            roomName={room.roomName}
                            playerCount={room.playerCount}
                            onClick={onClick}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default GameListComponent
