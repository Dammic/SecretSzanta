'use strict'
import React from 'react'

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
        </div>
    )
}

export default MainPageComponent