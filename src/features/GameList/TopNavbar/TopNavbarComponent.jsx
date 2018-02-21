import React from 'react'

export const TopNavbarComponent = ({
    onShowModal,
}) => (
    <div className="top-bar">
        <button onClick={onShowModal}>New room</button>
    </div>
)
