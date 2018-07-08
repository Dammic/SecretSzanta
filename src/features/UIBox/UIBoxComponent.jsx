import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications } from '../../../Dictionary'
import PlayerRoleComponent from '../PlayerBoard/Player/PlayerRole/PlayerRoleComponent'
import GameControls from './GameControls/GameControls'

import styles from './UIBox.css'

const UIBoxComponent = ({
    isAffiliationHidden,
    affiliation,
    getPlayerCard,
    role,
}) => {
    const facistsKinds = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
    const affiliationClassName = (includes(facistsKinds, affiliation)
        ? styles.facist
        : styles.liberal
    )

    return (
        <div className={styles.uiBox}>
            <GameControls />
            <div className={classNames(styles.submenu, { [styles.hidden]: isAffiliationHidden })}>
                <div className={styles.affiliationCards}>
                    <span className={classNames(styles.card, affiliationClassName)} />
                    <span className={styles.card}>
                        {getPlayerCard()}
                    </span>
                </div>
                <div className={styles.roleWrapper}>
                    <PlayerRoleComponent role={role} className={styles.uiBoxRole} />
                </div>
            </div>
        </div>
    )
}

UIBoxComponent.propTypes = {
    affiliation: PropTypes.string,
    isAffiliationHidden: PropTypes.bool,
    getPlayerCard: PropTypes.func,
    role: PropTypes.string,
}
export default UIBoxComponent
