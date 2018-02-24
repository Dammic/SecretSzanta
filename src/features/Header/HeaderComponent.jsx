import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { map } from 'lodash'
import { Views } from '../../../Dictionary'

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

    const headerNavigationClasses = classNames('header-navigation', { 'is-open': isMobileNavOpen })
    const menuIconClasses = classNames('fa', { 'fa-bars': !isMobileNavOpen, 'fa-times': isMobileNavOpen }, 'menu-icon')

    return (
        <div className="header-container">
            <div className="header">
                <span className="app-name" onClick={closeMobileNavigation}>Secret Hitler</span>
                <div className={headerNavigationClasses}>
                    <i className={menuIconClasses} onClick={isMobileNavOpen ? closeMobileNavigation : openMobileNavigation} />
                    <div className="header-navigation-links">
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
