'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'

const MainPageComponent = ({
    socket,
    userName,
    playersList = []
}) => {
    return (
        <div>
            {playersList.map((playerName) => <div key={playerName}>{playerName}</div>)}
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default MainPageComponent

