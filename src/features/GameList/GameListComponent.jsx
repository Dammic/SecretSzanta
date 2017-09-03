import React from 'react'
import PropTypes from 'prop-types'
import GameListItemComponent from './GameListItemComponent'
import TopNavbar from './TopNavbar/TopNavbar'

const GameListComponent = ({
    userName,
    rooms,
    onClick,
}) => {
    return (
        <div className="game-room">
            <TopNavbar />
            Hello {userName}!
            <div className="game-list">
                {rooms.map((room) => {
                    return (
                        <GameListItemComponent
                            key={room.roomID}
                            roomID={room.roomID}
                            roomName={room.roomName}
                            playerCount={room.playerCount}
                            onClick={onClick}
                        />
                    )
                })}
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
