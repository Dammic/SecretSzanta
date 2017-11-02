import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import GameListItemComponent from './GameListItemComponent'
import TopNavbar from './TopNavbar/TopNavbar'
import PlayersList from './PlayersList/PlayersList'

const GameListComponent = ({
    userName,
    rooms,
    onClick,
}) => {
    return (
        <div className="game-room">
            <TopNavbar />
            Hello {userName}!
            <div className="game-list-container">
                <div className="first-column">
                    <div className="game-list">
                        {map(rooms, room => (
                            <GameListItemComponent
                                key={room.roomID}
                                roomID={room.roomID}
                                roomName={room.roomName}
                                playerCount={room.playerCount}
                                onClick={onClick}
                            />
                        ))}
                    </div>
                </div>
                <PlayersList />
            </div>
        </div>
    )
}

GameListComponent.propTypes = {
    userName: PropTypes.string,
    rooms: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    onClick: PropTypes.func,
}
export default GameListComponent
