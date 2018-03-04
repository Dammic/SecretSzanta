import React from 'react'
import { map } from 'lodash'
import PlayerAvatar from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'

export const GameEndModalComponent = ({ players }) => (
    <div className="game-end-modal">
        {map(players, player => (
            <PlayerAvatar
                liberalAvatar={player.avatarNumber}
                facistAvatar={player.facistAvatar}
                isDead={player.isDead}
            />
        ))}
    </div>
)
