'use strict'
import React from 'react'
import GameListItemComponent from './GameListItemComponent'

const GameListComponent = ({
    title,
    rooms,
    onClick,
    showModal,
    closeModal,

}) => {
    const renderRooms = () => {
        let renderedRooms = []
        console.info(rooms)
        for(let i = 0; i < rooms.length; i = i + 2) {
            let renderedRow = []
            if(i < rooms.length) renderedRow.push(<GameListItemComponent roomID={rooms[i].roomID} roomName={rooms[i].roomName} playerCount={rooms[i].playerCount} onClick={onClick}/>)
            if(i+1 < rooms.length) renderedRow.push(<GameListItemComponent roomID={rooms[i+1].roomID} roomName={rooms[i+1].roomName} playerCount={rooms[i+1].playerCount} onClick={onClick}/>)
            renderedRooms.push(
                <tr className="game-list-row">
                    {renderedRow}
                </tr>
            )
        }
        return renderedRooms
    }

    return (
        <div className="main-page">
            Hello {title}!
            <table className="game-list">
                <tbody>
                    {renderRooms()}
                </tbody>
            </table>
        </div>
    )
}

export default GameListComponent
