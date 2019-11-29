import React from 'react'
import { map } from 'lodash'
import { PlayerAvatar } from '../../Shared/PlayerAvatar'

import styles from './GameEndModal.module.css'

export const GameEndModalComponent = ({ players }) => (
    <div className={styles.gameEndModal}>
        {map(players, player => (
            <div key={player.playerName} className={styles.playerContainer}>
                <div>{player.playerName}</div>
                <PlayerAvatar
                    liberalAvatar={player.avatarNumber}
                    fascistAvatar={player.facistAvatar}
                    isDead={player.isDead}
                />
            </div>
        ))}
    </div>
)
