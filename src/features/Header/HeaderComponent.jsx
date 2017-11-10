import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { map } from 'lodash'
import { Views } from '../../../Dictionary'

const HeaderComponent = ({ setView, currentView, isLobbyVisible }) => {
    const renderNavigationLink = (label, key) => {
        const onNavClick = () => setView(key)
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

    return (
        <div className="header-container">
            <div className="header">
                <span className="app-name">Secret Hitler</span>
                <div className="header-navigation">
                    {map(views, renderNavigationLink)}
                </div>
            </div>
        </div>
    )
}

HeaderComponent.propTypes = {
    setView: PropTypes.func.isRequired,
    isLobbyVisible: PropTypes.bool.isRequired,
    currentView: PropTypes.string,
}

export default HeaderComponent
