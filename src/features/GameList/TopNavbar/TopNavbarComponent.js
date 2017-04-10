'use strict'
import React from 'react'
import CreateGameModal from '../CreateGameModal/CreateGameModal'

const TopNavbarComponent = ({
    isModalShown,
    showModal,
    onHide,
    onCreate,
    socket
}) => {
    return (
        <div className="top-bar">
            <button onClick={showModal}>Create</button>
            <CreateGameModal showModal={isModalShown} onHide={onHide} onCreate={onCreate} socket={socket}/>
        </div>
    )
}

export default TopNavbarComponent
