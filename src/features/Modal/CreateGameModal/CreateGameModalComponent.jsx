import React from 'react'

const CreateGameModalComponent = ({
    onChange,
    onClick,
}) => {
    return (
        <div className="create-game-modal">
            <div className="input-field"> Room Name: <input name="room_name" type="text" placeholder="" onChange={onChange} /></div>
            <div className="input-field"> <div>Password<i>(optional)</i>:</div> <input name="password" type="password" placeholder="" onChange={onChange} /></div>
            <div className="input-field">Number of players: <input name="number_of_players" type="number"
                                           min="5" max="10" defaultValue="5" onChange={onChange} /></div>
            <div className="create-button" onClick={onClick}>Create</div>
        </div>
    )
}

export default CreateGameModalComponent
