import React from 'react'

const CreateGameModalComponent = ({
    onCreate,
    onRoomNameChange,
    onPasswordChange,
    onNumberOfPlayersChange,
}) => {
    return (
        <div className="create-game-modal">
            <div className="input-field">
                {'Room Name:'}
                <input type="text" placeholder="" onChange={onRoomNameChange} />
            </div>
            <div className="input-field">
                <div>Password<i>(optional)</i>:</div>
                <input name="password" type="password" placeholder="" onChange={onPasswordChange} />
            </div>
            <div className="input-field">
                {'Number of players:'}
                <input
                    type="number"
                    min="5"
                    max="10"
                    defaultValue="5"
                    onChange={onNumberOfPlayersChange}
                />
            </div>
            <div className="create-button" onClick={onCreate}>Create</div>
        </div>
    )
}

export default CreateGameModalComponent
