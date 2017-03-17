'use strict'
import React from 'react'

const GameListItemComponent = ({
    name
}) => {
    return (
        <li key={name} className="name">
            <div>{name}</div>
            <button>JOIN</button>
        </li>
    )
}

export default GameListItemComponent