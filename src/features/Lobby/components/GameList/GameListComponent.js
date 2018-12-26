import React  from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'

import styles from './GameList.css'


// TODO: TODO: TODO: USECALLBACK!!!!
export const GameListComponent = ({ rooms, onClick }) => (
    <div className={styles.gameList}>
        {map(rooms, ({ roomName, playerCount, roomId }) => (
            <div key={roomName} className={styles.gameListElement}>
                <div className={styles.gameElementContainer}>
                    <div>
                        <div>{roomName} |{playerCount}/9999</div>
                    </div>
                    <div>
                        <button onClick={() => onClick(roomId)}>
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