import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../Shared/Buttons'
import { Icon } from '../Shared/Icon'

import styles from './GameList.css'

const GameListItemComponent = ({
    roomId,
    roomName,
    playersCount,
    maxPlayers,
    onClick,
}) => {
    return (
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
    )
}

GameListItemComponent.propTypes = {
    roomId: PropTypes.string,
    roomName: PropTypes.string,
    playersCount: PropTypes.number,
    maxPlayers: PropTypes.number,
    onClick: PropTypes.func,
}

export default GameListItemComponent
