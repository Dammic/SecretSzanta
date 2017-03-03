'use strict'
import React from 'react'

const GameListComponent = ({
    title,
    userNames
}) => {
    console.info(userNames)
    return (
        <div className="main-page">
            Hello {title}!
            <ul data-columns="2">
                {userNames.map((name) => {
                    return (
                        <li key={name} className="name">
                            {name}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default GameListComponent