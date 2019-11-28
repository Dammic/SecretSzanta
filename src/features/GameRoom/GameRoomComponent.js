import React from 'react'
import { UIBox } from '../UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import Chat from '../Chat/Chat'
import Timer from '../Timer/Timer'

import styles from './GameRoom.module.css'

const GameRoomComponent = () => {
    return (
        <div className={styles.gameRoom}>
            <PlayerBoard />
            <UIBox />
            <Chat />
            <Timer />
        </div>
    )
}

export default GameRoomComponent

