import React from 'react'
import { map } from 'lodash'
import PlayerAvatarComponent from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'

const WinningModalComponent = ({ winners, losers }) => {
    return (
        <div className="winning-modal">
            <div className="winning-modal-list">
                {map(winners, winner => (
                    <div className="winner-dance">
                        <div className="avatar-name">{winner.playerName}</div>
                        <PlayerAvatarComponent
                            key={winner.playerName}
                            liberalAvatar={winner.avatarNumber}
                            facistAvatar={winner.facistAvatar}
                        />
                    </div>
                ))}
            </div>
            <div className="winning-modal-list">
                {map(losers, loser => (
                    <div>
                        <div className="avatar-name">{loser.playerName}</div>
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
