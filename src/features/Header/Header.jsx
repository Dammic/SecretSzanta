import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setView } from '../../ducks/userDuck'
import HeaderComponent from './HeaderComponent'

export class Header extends React.PureComponent {
    static propTypes = {
        currentView: PropTypes.string,
        userName: PropTypes.string,
    }
    
    setNewView = (newView) => {
        this.props.setView({ viewName: newView })
    }

    render() {
        const { currentView, userName } = this.props
        const shouldDisplayLobbyNav = (!!userName)
        return (
            <HeaderComponent
                setView={this.setNewView}
                currentView={currentView}
                isLobbyVisible={shouldDisplayLobbyNav}
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
