import React from 'react'
import PropTypes from 'prop-types'

const CreateGameModalComponent = ({
    onCreate,
    onRoomNameChange,
    onPasswordChange,
    onMaxPlayersChange,
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
                {'Maximal number of players:'}
                <input
                    type="number"
                    min="5"
                    max="10"
                    defaultValue="5"
                    onChange={onMaxPlayersChange}
                />
            </div>
            <button className="create-button" onClick={onCreate}>Create</button>
        </div>
    )
}

CreateGameModalComponent.propTypes = {
    onCreate: PropTypes.func,
    onRoomNameChange: PropTypes.func,
    onPasswordChange: PropTypes.func,
    onMaxPlayersChange: PropTypes.func,
}

export default CreateGameModalComponent
