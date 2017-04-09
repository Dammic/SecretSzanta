'use strict'
import React from 'react'
import GameListItemComponent from './GameListItemComponent'

const GameListComponent = ({
    title,
    rooms,
    onClick,
    showModal,
    closeModal
}) => {
    return (
        <div className="game-room">
            Hello {title}!
            <div className="game-list" >
                <ul>
                {rooms.map((room)=>{
                    const {roomID, roomName, playerCount} = room
                    return (
                        <GameListItemComponent roomID={roomID} roomName={roomName} playerCount={playerCount} onClick={onClick}/>
                    )
                })}
                </ul>
            </div>
        </div>
    )
}

export default GameListComponent
