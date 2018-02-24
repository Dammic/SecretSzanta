import React from 'react'
import PropTypes from 'prop-types'
import { map, filter, reject, size } from 'lodash'
import PlayersListRow from './PlayersListRow'

const PlayersListComponent = ({ players }) => {
    return (
        <div className="players-list">
            <div className="category">
                <span>Online: <b>{size(players)}</b></span>
            </div>
            {map(filter(players, player => !!player.currentRoom), player => (
                <PlayersListRow
                    key={player.playerName}
                    playerName={player.playerName}
                    avatarNumber={player.avatarNumber}
                    currentRoom={player.currentRoom}
                />
            ))}
            {map(reject(players, player => !!player.currentRoom), player => (
                <PlayersListRow
                    key={player.playerName}
                    playerName={player.playerName}
                    avatarNumber={player.avatarNumber}
                    currentRoom={player.currentRoom}
                />
            ))}
        </div>
    )
}

PlayersListComponent.propTypes = {
    players: PropTypes.objectOf(PropTypes.any),
}

export default PlayersListComponent
