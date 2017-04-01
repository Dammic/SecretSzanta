'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'

const MainPageComponent = ({
    socket,
    userName,
    playersList = []
}) => {
    return (
        <div className="main-page">
            {playersList.map((playerName) => <div key={playerName}>{playerName}</div>)}
            <PlayerBoard />
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default MainPageComponent

