import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications } from '../../../../Dictionary'
import PlayerAvatar from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatar'

import styles from './Submenu.css'

const renderPlayerCard = (liberalAvatar, fascistAvatar, isOwner, isDead, role) => {
    if (!liberalAvatar) return null

    return (
        <PlayerAvatar
            liberalAvatar={liberalAvatar}
            fascistAvatar={fascistAvatar}
            isOwner={isOwner}
            isDead={isDead}
            role={role}
            className={styles.uiBoxAvatar}
        />
    )
}

const fascistsKinds = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]

const SubmenuComponent = ({
    isAffiliationHidden,
    affiliation,
    role,
    liberalAvatar,
    fascistAvatar,
    isOwner,
    isDead,
}) => {
    const affiliationClassName = (includes(fascistsKinds, affiliation)
        ? styles.facist
        : styles.liberal
    )

    return (
        <div className={classNames(styles.submenu, { [styles.hidden]: isAffiliationHidden })}>
            <div className={styles.affiliationCards}>
                <span className={classNames(styles.card, affiliationClassName)} />
                <span className={styles.card}>
                    {renderPlayerCard(liberalAvatar, fascistAvatar, isOwner, isDead, role)}
                </span>
            </div>
        </div>
    )
}

SubmenuComponent.displayName = 'SubmenuComponent'
SubmenuComponent.propTypes = {
    affiliation: PropTypes.string,
    isAffiliationHidden: PropTypes.bool,
    role: PropTypes.string,
    liberalAvatar: PropTypes.number,
    fascistAvatar: PropTypes.number,
    isOwner: PropTypes.bool,
    isDead: PropTypes.bool,
}
export default SubmenuComponent
