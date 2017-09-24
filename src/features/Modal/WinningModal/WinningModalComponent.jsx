import React from 'react'
import { map } from 'lodash'
import PlayerAvatarComponent from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'

const WinningModalComponent = ({ winners, losers }) => {
    return (
        <div className="winning-modal">
            <div className="winning-modal-list">
                {map(winners, winner => (
                    <PlayerAvatarComponent
                        key={winner.playerName}
                        liberalAvatar={winner.avatarNumber}
                        facistAvatar={winner.facistAvatar}
                        className="winner-dance"
                    />
                ))}
            </div>
            <div className="winning-modal-list">
                {map(losers, loser => (
                    <div>
                        <PlayerAvatarComponent
                            key={loser.playerName}
                            liberalAvatar={loser.avatarNumber}
                            facistAvatar={loser.facistAvatar}
                            className="loser-sorrow"
                        />
                        <div className="drop" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WinningModalComponent
