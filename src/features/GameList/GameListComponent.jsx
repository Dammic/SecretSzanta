import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import GameListItemComponent from './GameListItemComponent'
import TopNavbar from './TopNavbar/TopNavbar'
import PlayersList from './PlayersList/PlayersList'
import Chat from '../UIBox/Chat/Chat'

const GameListComponent = ({
    userName,
    rooms,
    onClick,
}) => {
    return (
        <div className="game-room">
            <div className="game-list-container">
                <div className="first-column">
                    <div className="game-list">
                        {map(rooms, room => (
                            <GameListItemComponent
                                key={room.roomId}
                                roomId={room.roomId}
                                roomName={room.roomName}
                                playerCount={room.playerCount}
                                onClick={onClick}
                            />
                        ))}
                    </div>
                </div>
                <div className="second-column">
                    <div className="utils-row">
                        <span className="ellipsis">Hello <b>{userName}</b>!</span>
                        <TopNavbar />
                    </div>
                    <PlayersList />
                    <Chat />
                </div>
            </div>
        </div>
    )
}

GameListComponent.propTypes = {
    userName: PropTypes.string,
    rooms: PropTypes.objectOf(PropTypes.objectOf(PropTypes.any)),
    onClick: PropTypes.func,
}
export default GameListComponent
