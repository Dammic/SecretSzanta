'use strict'
import React from 'react'
import Chat from './Chat/Chat'

const UIBoxComponent = ({
    onStartVote,
    onStartGame
}) => {
    return (
        <div className="ui-box">
            <button onClick={onStartVote}>voting (test)</button>
            <button onClick={onStartGame}>start game (test)</button>
            <Chat />
        </div>
    )
}

export default UIBoxComponent
