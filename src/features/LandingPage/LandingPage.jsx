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

require('../../styles/main.scss')

export class LandingPage extends React.PureComponent {
    static propTypes = {
        currentView: PropTypes.string,
    }

    getCurrentView = () => {
        const { currentView } = this.props
        if (currentView === Views.HowToPlay) {
            return <div>How to play</div>
        } else if (currentView === Views.News) {
            return <div>news</div>
        } else if (currentView === Views.About) {
            return <div>about</div>
        } else if (currentView === Views.Lobby) {
            return <GameList />
        } else {
            return <LoginPage />
        }
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
