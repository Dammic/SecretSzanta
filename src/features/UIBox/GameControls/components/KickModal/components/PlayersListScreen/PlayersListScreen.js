import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ControlButton } from '../../../../../../Shared/Buttons'
import { KickModalTypes } from '../../KickModal'

import styles from './PlayersListScreen.css'

const items = ['aaa', 'bbb', 'ccc']

export const PlayersListScreen = ({ onNextStepClick, onPlayerSelect, selectedPlayer, type }) => {
    return (
        <div className={styles.container}>
            <span className={styles.explanationText}>
                {`Here you can select which player to ${type === KickModalTypes.Kick ? 'kick' : 'ban'}`}
            </span>
            <div className={styles.playersList}>
                {items.map((val) => (
                    <div
                        key={val}
                        className={classNames(styles.item, { [styles.active]: selectedPlayer === val })}
                        onClick={() => onPlayerSelect(val)}
                    >
                        {val}
                    </div>
                ))}
            </div>
            <ControlButton
                onClick={onNextStepClick}
                disabled={!selectedPlayer}
            >
                {type === KickModalTypes.Kick ? 'Kick player' : 'Ban player'}
            </ControlButton>
        </div>
    )
}

PlayersListScreen.propTypes = {
    onNextStepClick: PropTypes.func.isRequired,
    onPlayerSelect: PropTypes.func.isRequired,
    selectedPlayer: PropTypes.string,
    type: PropTypes.string,
}
