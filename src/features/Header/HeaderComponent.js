import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { map } from 'lodash'

import { Views } from '../../../Dictionary'
import { Icon } from '../Shared/Icon'

import styles from './Header.module.css'

const HeaderComponent = ({
    setView,
    currentView,
    isLobbyVisible,
    isMobileNavOpen,
    openMobileNavigation,
    closeMobileNavigation,
}) => {
    const renderNavigationLink = (label, key) => {
        const onNavClick = () => {
            setView(key)
            closeMobileNavigation()
        }
        return (
            <span
                key={key}
                className={classNames({ active: currentView === key })}
                onClick={onNavClick}
            >
                {label}
            </span>
        )
    }

    const views = {
        [Views.Home]: 'Home',
        [Views.Lobby]: 'Lobby',
        [Views.HowToPlay]: 'How to play',
        [Views.News]: 'News',
        [Views.About]: 'About',
    }
    if (!isLobbyVisible) {
        delete views[Views.Lobby]
    }

    const headerNavigationClasses = classNames(styles.headerNavigation, { [styles.isOpen]: isMobileNavOpen })
    const menuIconClasses = classNames({ 'fa-bars': !isMobileNavOpen, 'fa-times': isMobileNavOpen })

    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <span className={styles.appName} onClick={closeMobileNavigation}>Secret Hitler</span>
                <div className={headerNavigationClasses}>
                    <Icon
                        name={menuIconClasses}
                        onClick={isMobileNavOpen ? closeMobileNavigation : openMobileNavigation}
                        className={styles.menuIcon}
                    />
                    <div className={styles.headerNavigationLinks}>
                        {map(views, renderNavigationLink)}
                    </div>
                </div>
            </div>
        </div>
    )
}

HeaderComponent.propTypes = {
    setView: PropTypes.func.isRequired,
    isLobbyVisible: PropTypes.bool.isRequired,
    currentView: PropTypes.string,
    isMobileNavOpen: PropTypes.bool,
    openMobileNavigation: PropTypes.func,
    closeMobileNavigation: PropTypes.func,
}

export default HeaderComponent
