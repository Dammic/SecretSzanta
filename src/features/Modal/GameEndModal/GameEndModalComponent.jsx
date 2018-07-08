import React from 'react'
import { map } from 'lodash'
import PlayerAvatar from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'

import styles from './GameEndModal.css'

export const GameEndModalComponent = ({ players }) => (
    <div className={styles.gameEndModal}>
        {map(players, player => (
            <div key={player.playerName} className={styles.playerContainer}>
                <div>{player.playerName}</div>
                <PlayerAvatar
                    liberalAvatar={player.avatarNumber}
                    facistAvatar={player.facistAvatar}
                    isDead={player.isDead}
                />
            </div>
        ))}
    </div>
)
