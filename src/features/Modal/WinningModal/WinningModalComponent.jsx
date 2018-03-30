import React from 'react'
import { map } from 'lodash'
import PlayerAvatarComponent from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'

import styles from './WinningModal.css'

const WinningModalComponent = ({ winners, losers }) => {
    return (
        <div className={styles.winningModal}>
            <div className={styles.list}>
                {map(winners, winner => (
                    <div className={styles.winnerDance}>
                        <div className={styles.avatarName}>{winner.playerName}</div>
                        <PlayerAvatarComponent
                            key={winner.playerName}
                            liberalAvatar={winner.avatarNumber}
                            facistAvatar={winner.facistAvatar}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.list}>
                {map(losers, loser => (
                    <div>
                        <div className={styles.avatarName}>{loser.playerName}</div>
                        <PlayerAvatarComponent
                            key={loser.playerName}
                            liberalAvatar={loser.avatarNumber}
                            facistAvatar={loser.facistAvatar}
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
