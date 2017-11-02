import React from 'react'
import PropTypes from 'prop-types'

const PlayersListRow = ({ playerName, avatarNumber }) => {

    const avatarPicture = require(`../../../static/Avatar${avatarNumber}.png`)
    return (
        <div>
            <img className="avatar" src={avatarPicture} alt="Player avatar" />
            <span></span>
            <span>{playerName}</span>
        </div>
    )
}

PlayersListRow.propTypes = {
    playerName: PropTypes.string.isRequired,
    avatarNumber: PropTypes.number.isRequired,
}

export default PlayersListRow
