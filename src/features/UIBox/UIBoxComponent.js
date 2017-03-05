'use strict'
import React from 'react'
import Chat from '../Chat/Chat'

const UIBoxComponent = ({
    socket
}) => {
    return (
        <div className="ui-box">
            <div></div>
            <Chat socket={socket} />

        </div>
    )
}

export default UIBoxComponent
