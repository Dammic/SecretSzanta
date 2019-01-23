import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../../Shared/Buttons'

import styles from './CreateGameModal.css'

const CreateGameModalComponent = ({
    roomName,
    password,
    maxPlayers,
    onCreate,
    onChange,
}) => {
    return (
        <div className={styles.createGameModal}>
            <div className={styles.inputField}>
                {'Room Name:'}
                <input name="roomName" type="text" value={roomName} onChange={onChange} />
            </div>
            <div className={styles.inputField}>
                <div>Password<i>(optional)</i>:</div>
                <input name="password" type="password" value={password} onChange={onChange} />
            </div>
            <div className={styles.inputField}>
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
            <ControlButton className={styles.createButton} onClick={onCreate}>Create</ControlButton>
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
