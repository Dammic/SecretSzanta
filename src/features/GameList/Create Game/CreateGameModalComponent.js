'use strict'
import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'

const CreateGameModalComponent = ({
    showModal,
    onHide,
    onCreate,
    socket
}) => {
    return (
        <Modal show={showModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div> Room Name: <input type="text" name="roomname" placeholder=""/></div>
                <div>Use Password <input type="checkbox"/></div>
                <div> Password: <input type="password" name="password" placeholder=""/></div>
                <div>Number of players: <input type="number" min="5" max="10"/></div>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={onCreate}>Create</Button>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateGameModalComponent
