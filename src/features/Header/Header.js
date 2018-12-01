import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setView } from '../../ducks/userDuck'
import HeaderComponent from './HeaderComponent'

export class Header extends React.PureComponent {
    static propTypes = {
        setView: PropTypes.func.isRequired,
        currentView: PropTypes.string,
        userName: PropTypes.string,
    }

    state = {
        isMobileNavOpen: false,
    }

    setNewView = (newView) => {
        this.props.setView({ viewName: newView })
    }

    openMobileNavigation = () => {
        this.setState({ isMobileNavOpen: true })
    }

    closeMobileNavigation = () => {
        this.setState({ isMobileNavOpen: false })
    }

    render() {
        const { currentView, userName } = this.props
        const { isMobileNavOpen } = this.state
        const shouldDisplayLobbyNav = (!!userName)
        return (
            <HeaderComponent
                setView={this.setNewView}
                currentView={currentView}
                isLobbyVisible={shouldDisplayLobbyNav}
                isMobileNavOpen={isMobileNavOpen}
                openMobileNavigation={this.openMobileNavigation}
                closeMobileNavigation={this.closeMobileNavigation}
            />
        )
    }
}

const mapStateToProps = ({ user: { currentView, userName } }) => ({
    currentView,
    userName,
})

const mapDispatchToProps = dispatch => ({
    setView: payload => dispatch(setView(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
