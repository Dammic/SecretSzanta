'use strict'
import React from 'react'

const ModalComponent = ({
    body,
    closeModal
}) => {
    return (
        <div className="modal-container">
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="modal">
                {body}
            </div>
        </div>
    )
}

export default ModalComponent

