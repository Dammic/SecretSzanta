import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getAvatar } from '../../../../utils/avatarsHelper'

import styles from './PlayersList.module.css'
import commonStyles from '../../../Shared/CommonStyles/commonStyles.module.css'

export const PlayersListRow = ({ playerName, avatarNumber, currentRoom }) => {
    return (
        <div className={classNames(styles.playerRow, { [styles.busy]: !!currentRoom })}>
            <img
                className={styles.avatar}
                src={getAvatar(`liberal-${avatarNumber}`)}
                alt="Player avatar"
            />
            <span className={classNames(commonStyles.ellipsis, styles.playerName)}>{playerName}</span>
            {currentRoom && (
                <Fragment>
                    <span className={classNames(commonStyles.ellipsis, styles.roomName)}>
                        <span>
                            <span>room:{' '}</span>
                            <b className={styles.roomNameText}>{currentRoom}</b>
                        </span>
                    </span>
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
