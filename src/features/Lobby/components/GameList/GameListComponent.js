import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Icon } from '../../../Shared/Icon'
import { ControlButton } from '../../../Shared/Buttons'

import styles from './GameList.css'

export const GameListComponent = ({ rooms, onClick }) => (
    <div className={styles.gameList}>
        {map(rooms, ({ roomName, playersCount, roomId, maxPlayers }) => (
            <div key={roomName} className={styles.gameListElement}>
                <div className={styles.gameElementContainer}>
                    <div className={styles.roomName}>{roomName}</div>
                    <div className={styles.rightSide}>
                        <ControlButton onClick={() => onClick(roomId)} className={styles.button}>
                            join
                        </ControlButton>
                        <span className={styles.playerCount}>
                            {playersCount}/{maxPlayers}
                            <Icon name="fa-user" className={styles.icon} />
                        </span>
                    </div>
                </div>
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
    onClick: PropTypes.func,
}
