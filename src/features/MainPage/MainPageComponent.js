'use strict'
import React from 'react'
import Chat from '../Chat/Chat'


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
            <Chat />
        </div>
    )
}

export default MainPageComponent