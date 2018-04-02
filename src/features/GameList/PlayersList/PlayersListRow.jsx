import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../utils/avatarsHelper'
import { EllipsisText } from '../../Shared/EllipsisText'

import styles from './PlayersList.css'

const PlayersListRow = ({ playerName, avatarNumber, currentRoom }) => {
    return (
        <div className={classNames(styles.playerRow, { [styles.busy]: !!currentRoom })}>
            <img
                className={styles.avatar}
                src={getAvatar(`liberal-${avatarNumber}`)}
                alt="Player avatar"
            />
            <EllipsisText className={styles.playerName}>{playerName}</EllipsisText>
            {currentRoom && (
                <Fragment>
                    <EllipsisText className={styles.roomName}>
                        <span>room:{' '}</span>
                        <b className={styles.roomNameText}>{currentRoom}</b>
                    </EllipsisText>
                    <span className={classNames(styles.roomName, styles.mobile)}>Busy</span>
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
