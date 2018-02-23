import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../utils/avatarsHelper'

const PlayersListRow = ({ playerName, avatarNumber, currentRoom }) => {
    return (
        <div className={classNames('player-row', { busy: !!currentRoom })}>
            <img
                className="avatar"
                src={getAvatar(`liberal-${avatarNumber}`)}
                alt="Player avatar"
            />
            <span className="player-name ellipsis">{playerName}</span>
            {currentRoom && (
                <React.Fragment>
                    <span className="room-name ellipsis">
                        <span>room:{' '}</span>
                        <b className="room-name-text">{currentRoom}</b>
                    </span>
                    <span className="room-name mobile">Busy</span>
                </React.Fragment>
            )}
        </div>
    )
}

PlayersListRow.propTypes = {
    playerName: PropTypes.string.isRequired,
    avatarNumber: PropTypes.number.isRequired,
    currentRoom: PropTypes.string,
}

export default PlayersListRow
