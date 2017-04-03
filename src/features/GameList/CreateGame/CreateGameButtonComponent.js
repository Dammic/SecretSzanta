'use strict'
import React from 'react'

const CreateGameButtonComponent = ({
    onClick
}) => {
    return (
        <div className="top-bar">
            <button onClick={onClick}>Create Game</button>
        </div>
    )
}

export default CreateGameButtonComponent