'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'

const MainPageComponent = ({
    title,
    userNames
}) => {
    console.info(userNames)
    return (
        <div className="main-page">
            Hello {title}!
            {userNames.map((name) => {
                return (
                    <div key={name} className="name">
                        {name}
                    </div>
                )
            })}
            <UIBox />
        </div>
    )
}

export default MainPageComponent
