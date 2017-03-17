'use strict'
import React from 'react'
import GameListItemComponent from './GameListItemComponent'

const GameListComponent = ({
    title,
    userNames
}) => {
    console.info(userNames)
    let evenNames = [], oddNames = [];
    userNames.map((name, index) =>{
        index%2 === 0 ? evenNames.push(name) : oddNames.push(name)
    })
    return (
        <div className="main-page">
            Hello {title}!
            <div className="game-list" >
                <ul>
                {userNames.map((name)=>{
                    return (
                        <GameListItemComponent name={name}/>
                    )
                })}
                </ul>
            </div>
        </div>
    )
}

export default GameListComponent
