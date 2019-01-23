import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../Shared/Buttons'

import styles from './GameList.css'

const GameListItemComponent = ({
    roomId,
    roomName,
    playerCount,
    onClick,
}) => {
    return (
        <div key={roomName} className={styles.gameListElement}>
            <div className={styles.gameElementContainer}>
                <div>
                    <div>{roomName} |{playerCount}/9999</div>
                </div>
                <div>
                    <ControlButton onClick={() => onClick(roomId)}>
                        join
                    </ControlButton>
                </div>
            </div>
        </div>
    )
}

GameListItemComponent.propTypes = {
    roomId: PropTypes.string,
    roomName: PropTypes.string,
    playerCount: PropTypes.number,
    onClick: PropTypes.func,
}

export default GameListItemComponent
