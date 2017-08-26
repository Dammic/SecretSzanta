import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'

const GameRoomComponent = () => {
    return (
        <div className="game-room">
            <PlayerBoard />
            <UIBox />
        </div>
    )
}

export default GameRoomComponent

