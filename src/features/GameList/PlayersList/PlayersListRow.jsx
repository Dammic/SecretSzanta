import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../utils/avatarsHelper'
import { EllipsisText } from '../../Shared/EllipsisText'

const PlayersListRow = ({ playerName, avatarNumber, currentRoom }) => {
    return (
        <div className={classNames('player-row', { busy: !!currentRoom })}>
            <img
                className="avatar"
                src={getAvatar(`liberal-${avatarNumber}`)}
                alt="Player avatar"
            />
            <EllipsisText className="player-name">{playerName}</EllipsisText>
            {currentRoom && (
                <Fragment>
                    <EllipsisText className="room-name">
                        <span>room:{' '}</span>
                        <b className="room-name-text">{currentRoom}</b>
                    </EllipsisText>
                    <span className="room-name mobile">Busy</span>
                </Fragment>
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
