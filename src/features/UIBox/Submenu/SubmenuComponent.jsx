import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { includes } from 'lodash'
import { PlayerAffilications } from '../../../../Dictionary'
import PlayerRoleComponent from '../../PlayerBoard/Player/PlayerRole/PlayerRoleComponent'
import PlayerAvatarComponent from '../../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'

import styles from './Submenu.css'

const renderPlayerCard = (liberalAvatar, fascistAvatar, isOwner, isDead) => {
    if (!liberalAvatar) return null

    return (
        <PlayerAvatarComponent
            liberalAvatar={liberalAvatar}
            facistAvatar={fascistAvatar}
            isOwner={isOwner}
            isDead={isDead}
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
                    {renderPlayerCard(liberalAvatar, fascistAvatar, isOwner, isDead)}
                </span>
            </div>
            <div className={styles.roleWrapper}>
                <PlayerRoleComponent role={role} className={styles.uiBoxRole} />
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
