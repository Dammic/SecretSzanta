'use strict'
import React from 'react'
import Chat from '../Chat/Chat'

const UIBoxComponent = ({
    socket,
    userName,
    onStartVote,
    onStartGame
}) => {
    return (
        <div className="ui-box">
            <button onClick={onStartVote}>voting (test)</button>
            <button onClick={onStartGame}>start game (test)</button>
            <Chat socket={socket} userName={userName}/>
        </div>
    )
}

export default UIBoxComponent
