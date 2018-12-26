import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'

import styles from './GameList.css'

export const GameListComponent = ({ rooms, onClick }) => (
    <div className={styles.gameList}>
        {map(rooms, room => (
            <div key={room.roomName} className={styles.gameListElement}>
                <div className={styles.gameElementContainer}>
                    <div>
                        <div>{room.roomName} |{room.playerCount}/9999</div>
                    </div>
                    <div>
                        <button data-roomid={room.roomId} onClick={onClick}>
                            JOIN
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

GameListComponent.propTypes = {
    rooms: PropTypes.objectOf(PropTypes.shape({
        roomName: PropTypes.string,
        playerCount: PropTypes.number,
        roomId: PropTypes.string,
    })),
    onClick: PropTypes.func,
}
