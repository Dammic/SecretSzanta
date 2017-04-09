'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'

const GameRoomComponent = ({
    socket,
    userName,
    playersList = []
}) => {
    return (
        <div className="game-room">
            <PlayerBoard />
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default GameRoomComponent

