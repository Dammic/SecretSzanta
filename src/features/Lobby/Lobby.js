import React from 'react'
import { GameList } from './components/GameList'
import { TopNavbar } from './components/TopNavbar'
import { PlayersList } from './components/PlayersList'
import Chat from '../Chat/Chat'

import styles from './Lobby.css'

export const Lobby = () => (
    <div className={styles.gameListContainer}>
        <div className={styles.firstColumn}>
            <GameList />
        </div>
        <div className={styles.secondColumn}>
            <TopNavbar />
            <PlayersList />
            <Chat className={styles.lobbyChat} />
        </div>
    </div>
)
