import React from 'react'
import { map } from 'lodash'
import { PlayerAvatar } from '../../Shared/PlayerAvatar'

import styles from './WinningModal.css'

const WinningModalComponent = ({ winners, losers }) => {
    return (
        <div className={styles.winningModal}>
            <div className={styles.list}>
                {map(winners, winner => (
                    <div key={winner.playerName} className={styles.winnerDance}>
                        <div className={styles.avatarName}>{winner.playerName}</div>
                        <PlayerAvatar
                            key={winner.playerName}
                            liberalAvatar={winner.avatarNumber}
                            fascistAvatar={winner.facistAvatar}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.list}>
                {map(losers, loser => (
                    <div key={loser.playerName}>
                        <div className={styles.avatarName}>{loser.playerName}</div>
                        <PlayerAvatar
                            key={loser.playerName}
                            liberalAvatar={loser.avatarNumber}
                            fascistAvatar={loser.facistAvatar}
                            className={styles.loserSorrow}
                        />
                        <div className={styles.drop} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WinningModalComponent
