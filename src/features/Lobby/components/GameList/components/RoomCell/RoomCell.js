import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '../../../../../Shared/Icon'
import { ControlButton } from '../../../../../Shared/Buttons'

import styles from './RoomCell.css'

const RoomCell = ({ room: { roomName, playersCount, roomId, maxPlayers, hasPassword }, onJoin }) => {
    const [showPasswordInput, setPasswordInputVisibility] = useState(false)
    const [password, setPassword] = useState('')

    const onClick = useCallback(
        () => {
            if (hasPassword && !showPasswordInput) {
                setPasswordInputVisibility(true)
                return
            }

            onJoin(roomId, password)
        },
        [hasPassword, setPasswordInputVisibility, roomId, password],
    )

    return (
        <div className={styles.room}>
            <div className={styles.roomName}>{roomName}</div>
            {showPasswordInput && (
                <input
                    autoFocus={true}
                    className={styles.passwordInput}
                    onChange={event => setPassword(event.target.value)}
                    onKeyDown={event => event.key === 'Enter' && onJoin(roomId, password)}
                    placeholder="Type password to room"
                    type="password"
                    value={password}
                />
            )}
            <div className={styles.rightSide}>
                <ControlButton onClick={onClick} className={styles.button}>
                    join
                    {hasPassword && <Icon name="fa-lock" className={styles.icon} />}
                </ControlButton>
                <span className={styles.playerCount}>
                    {playersCount}/{maxPlayers}
                    <Icon name="fa-user" className={styles.icon} />
                </span>
            </div>
        </div>
    )
}

RoomCell.propTypes = {
    room: PropTypes.shape({
        roomName: PropTypes.string,
        playersCount: PropTypes.number,
        roomId: PropTypes.string,
        maxPlayers: PropTypes.number,
        hasPassword: PropTypes.bool,
    }),
    onJoin: PropTypes.func,
}

export { RoomCell }
