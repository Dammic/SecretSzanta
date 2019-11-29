import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { map, size, groupBy } from 'lodash'
import { PlayersListRow } from './PlayersListRow'

import styles from './PlayersList.module.css'

export const PlayersList = ({ playersList }) => {
    const groupedPlayers = groupBy(playersList, player => !!player.currentRoom)

    return (
        <div className={styles.playersList}>
            <div className={styles.category}>
                <span>Online: <b>{size(playersList)}</b></span>
            </div>
            {map(groupedPlayers.true, player => (
                <PlayersListRow
                    key={player.playerName}
                    playerName={player.playerName}
                    avatarNumber={player.avatarNumber}
                    currentRoom={player.currentRoom}
                />
            ))}
            {map(groupedPlayers.false, player => (
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

PlayersList.propTypes = {
    playersList: PropTypes.objectOf(PropTypes.shape({
        playerName: PropTypes.string.isRequired,
        avatarNumber: PropTypes.number.isRequired,
        currentRoom: PropTypes.string,
    })),
}

const mapStateToProps = ({ lobby }) => ({
    playersList: lobby.playersList,
})

export default connect(mapStateToProps)(PlayersList)
