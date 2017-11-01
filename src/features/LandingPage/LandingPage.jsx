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

require('../../styles/main.scss')

export class LandingPage extends React.PureComponent {
    static propTypes = {
        currentView: PropTypes.string,
    }

    getCurrentView = () => {
        const { currentView } = this.props
        if (currentView === Views.HowToPlay) {
            return <HowToPlayComponent />
        } else if (currentView === Views.News) {
            return <News />
        } else if (currentView === Views.About) {
            return <AboutComponent />
        } else if (currentView === Views.Lobby) {
            return <GameList />
        }
        return <LoginPage />
    }

    render() {
        const { currentView } = this.props
        const viewComponent = (currentView === Views.Game
            ? <GameRoom />
            : (<div>
                <Header />
                {this.getCurrentView()}
            </div>)
        )

        return (
            <div className="landing-page">
                <Notifications />
                <SocketHandler />
                <Modal />
                {viewComponent}
            </div>
        )
    }
}

const mapStateToProps = ({ user: { currentView } }) => ({
    currentView,
})
export default connect(mapStateToProps)(LandingPage)
