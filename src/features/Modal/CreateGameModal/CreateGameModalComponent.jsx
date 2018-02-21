import React from 'react'
import PropTypes from 'prop-types'

const CreateGameModalComponent = ({
    roomName,
    password,
    maxPlayers,
    onCreate,
    onChange,
}) => {
    return (
        <div className="create-game-modal">
            <div className="input-field">
                {'Room Name:'}
                <input name="roomName" type="text" value={roomName} onChange={onChange} />
            </div>
            <div className="input-field">
                <div>Password<i>(optional)</i>:</div>
                <input name="password" type="password" value={password} onChange={onChange} />
            </div>
            <div className="input-field">
                {'Maximal number of players:'}
                <input
                    name="maxPlayers"
                    type="number"
                    min="5"
                    max="10"
                    value={maxPlayers}
                    onChange={onChange}
                />
            </div>
            <button className="create-button" onClick={onCreate}>Create</button>
        </div>
    )
}

CreateGameModalComponent.propTypes = {
    roomName: PropTypes.string,
    password: PropTypes.string,
    maxPlayers: PropTypes.number,
    onCreate: PropTypes.func,
    onChange: PropTypes.func,
}

export default CreateGameModalComponent
