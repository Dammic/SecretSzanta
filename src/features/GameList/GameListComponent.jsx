import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import GameListItemComponent from './GameListItemComponent'
import TopNavbar from './TopNavbar/TopNavbar'
import PlayersList from './PlayersList/PlayersList'
import Chat from '../UIBox/Chat/Chat'
import { EllipsisText } from '../Shared/EllipsisText'

import styles from './GameList.css'

const GameListComponent = ({
    userName,
    rooms,
    onClick,
}) => {
    return (
        <div className={styles.gameListContainer}>
            <div className={styles.firstColumn}>
                <div className={styles.gameList}>
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
            <div className={styles.secondColumn}>
                <div className={styles.utilsRow}>
                    <EllipsisText>Hello <b>{userName}</b>!</EllipsisText>
                    <TopNavbar />
                </div>
                <PlayersList />
                <Chat className={styles.lobbyChat} />
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
