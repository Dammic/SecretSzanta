'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'

const MainPageComponent = ({
    title,
    userNames,
    socket,
    userName
}) => {
    console.info(userNames)
    return (
        <div className="main-page">
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default MainPageComponent

