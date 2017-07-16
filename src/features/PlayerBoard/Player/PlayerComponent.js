import React from 'react'
import PropTypes from 'prop-types'
import { isUndefined } from 'lodash'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture,
    voteBubbleStyle,
    voteValue,
}) => {
    return (
        <div className="player">
            <div>{playerName}</div>
            {!isUndefined(voteValue) && <div className={voteBubbleStyle}>{voteValue}</div>}
            <img className="portrait" src={avatar} alt="Player image" />
            {rolePicture && <img className="role" src={rolePicture} alt="" />}
        </div>
    )
}

PlayerComponent.propTypes = {
    playerName: PropTypes.string,
    avatar: PropTypes.string,
    rolePicture: PropTypes.string,
    voteBubbleStyle: PropTypes.string,
    voteValue: PropTypes.string,
}
export default PlayerComponent
