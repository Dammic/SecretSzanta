'use strict'
import React from 'react'
import Modal from '../../Modal/Modal'

const CreateGameModalComponent = ({
    showModal,
    onHide,
    onCreate,
    socket
}) => {
    return (
        <Modal show={showModal} onHide={onHide} clickOutside={true}>
            <div>
                <div> Room Name: <input type="text" name="roomname" placeholder=""/></div>
                <div>Use Password <input type="checkbox"/></div>
                <div> Password: <input type="password" name="password" placeholder=""/></div>
                <div>Number of players: <input type="number" min="5" max="10"/></div>
            </div>
        </Modal>
    )
}

export default CreateGameModalComponent
