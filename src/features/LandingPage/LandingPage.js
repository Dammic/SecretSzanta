import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Views } from '../../../Dictionary'
import Header from '../Header/Header'
import LoginPage from '../LoginPage/LoginPage'
import GameRoom from '../GameRoom/GameRoom'
import GameList from '../GameList/GameList'
import SocketHandler from '../../utils/SocketHandler'
import Modal from '../Modal/Modal'
import Notifications from '../Notifications/Notifications'
import News from './StaticPages/News/News'
import HowToPlayComponent from './StaticPages/HowToPlay/HowToPlayComponent'
import AboutComponent from './StaticPages/About/AboutComponent'

import '../../styles/globals.css'
import styles from './LandingPage.css'

export class LandingPage extends React.PureComponent {
    static propTypes = {
        currentView: PropTypes.string,
    }

    componentDidUpdate() {
        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 0)
    }

    renderCurrentView = () => {
        const { currentView } = this.props

        if (currentView === Views.Game) {
            return <GameRoom />
        }

        let returnedView
        if (currentView === Views.HowToPlay) {
            returnedView = <HowToPlayComponent />
        } else if (currentView === Views.News) {
            returnedView = <News />
        } else if (currentView === Views.About) {
            returnedView = <AboutComponent />
        } else if (currentView === Views.Lobby) {
            returnedView = <GameList />
        } else {
            returnedView = <LoginPage />
        }

        return (
            <div className={styles.page}>
                <Header />
                {returnedView}
            </div>
        )
    }

    render() {
        return (
            <div className={styles.landingPage}>
                <Notifications />
                <SocketHandler />
                <Modal />
                {this.renderCurrentView()}
            </div>
        )
    }
}

const mapStateToProps = ({ user: { currentView } }) => ({
    currentView,
})
export default connect(mapStateToProps)(LandingPage)
