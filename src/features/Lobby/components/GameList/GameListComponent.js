import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'

import { RoomCell } from './components/RoomCell'
import styles from './GameList.module.css'

export const GameListComponent = ({ rooms, onJoin }) => (
    <div className={styles.gameList}>
        {map(rooms, (room) => (
            <div key={room.roomName} className={styles.gameListElement}>
                <RoomCell room={room} onJoin={onJoin} />
            </div>
        ))}
    </div>
)

GameListComponent.propTypes = {
    rooms: PropTypes.objectOf(PropTypes.shape({
        roomName: PropTypes.string,
        playersCount: PropTypes.number,
        roomId: PropTypes.string,
        maxPlayers: PropTypes.number,
    })),
    onJoin: PropTypes.func,
}
