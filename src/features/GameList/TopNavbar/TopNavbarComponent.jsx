'use strict'
import React from 'react'
import CreateGameModal from './CreateGameModal/CreateGameModal'

const TopNavbarComponent = ({
    isModalShown,
    showModal,
    onHide,
    onCreate
}) => {
    return (
        <div className="top-bar">
            <button onClick={showModal}>New room</button>
            <CreateGameModal showModal={isModalShown} onHide={onHide} onCreate={onCreate}/>
        </div>
    )
}

export default TopNavbarComponent
