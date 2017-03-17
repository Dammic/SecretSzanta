'use strict'
import React from 'react'
import Chat from '../Chat/Chat'

const UIBoxComponent = ({
    socket,
    userName
}) => {
    return (
        <div className="ui-box">
            <img src={require('../../static/cactus.jpg')}></img>
            <Chat socket={socket} userName={userName}/>

        </div>
    )
}

export default UIBoxComponent
