import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import Chat from '../UIBox/Chat/Chat'
import Timer from '../Timer/Timer'

const GameRoomComponent = () => {
    return (
        <div className="game-room">
            <PlayerBoard />
            <UIBox />
            <Chat />
            <Timer />
        </div>
    )
}

export default GameRoomComponent

