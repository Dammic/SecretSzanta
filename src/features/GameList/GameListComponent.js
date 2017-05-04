'use strict'
import React from 'react'
import GameListItemComponent from './GameListItemComponent'
import TopNavbar from './TopNavbar/TopNavbar'

const GameListComponent = ({
    userName,
    rooms,
    onClick,
    socket
}) => {
    return (
        <div className="game-room">
            <TopNavbar socket={socket}/>
            Hello {userName}!
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
