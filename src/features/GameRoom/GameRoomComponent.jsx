import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import Chat from '../UIBox/Chat/Chat'

const GameRoomComponent = () => {
    return (
        <div className="game-room">
            <PlayerBoard />
            <UIBox />
            <Chat />
        </div>
    )
}

export default GameRoomComponent

