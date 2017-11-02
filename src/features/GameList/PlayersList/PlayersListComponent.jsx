import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import PlayersListRow from './PlayersListRow'

const PlayersListComponent = ({ players }) => {
    return (
        <div className="players-list">
            <div className="category">
                <span>Currently logged players: <b>0</b></span>
            </div>
            {map(players, player => (
                <PlayersListRow
                    key={player.playerName}
                
                />
            ))}
        </div>
    )
}

PlayersListComponent.propTypes = {
    players: PropTypes.arrayOf(PropTypes.object),

}

export default PlayersListComponent
