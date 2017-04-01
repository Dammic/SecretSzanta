'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'

const MainPageComponent = ({
    title,
    userNames,
    socket,
    userName
}) => {
    console.info(userNames)
    return (
        <div className="main-page">
            <PlayerBoard />
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default MainPageComponent

