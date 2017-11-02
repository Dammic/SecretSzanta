import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const PlayersListRow = ({ playerName, avatarNumber, currentRoom }) => {
    const avatarPicture = require(`../../../static/Avatar${avatarNumber}.png`)
    return (
        <div className={classNames('player-row', { busy: !!currentRoom })}>
            <img className="avatar" src={avatarPicture} alt="Player avatar" />
            <span>{playerName}</span>
            {currentRoom && <span className="room-name">
                <span className="small-font">room:{' '}</span>
                <b>{currentRoom}</b>
            </span>}
        </div>
    )
}

PlayersListRow.propTypes = {
    playerName: PropTypes.string.isRequired,
    avatarNumber: PropTypes.number.isRequired,
}

export default PlayersListRow
