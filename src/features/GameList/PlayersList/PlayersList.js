import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PlayersListComponent from './PlayersListComponent'

class PlayersList extends PureComponent {
    static propTypes = {
        playersList: PropTypes.object,
    }
    render() {
        const { playersList } = this.props
        return (
            <PlayersListComponent
                players={playersList}
            />
        )
    }
}

const mapStateToProps = ({ lobby }) => ({
    playersList: lobby.playersList,
})

export default connect(mapStateToProps)(PlayersList)
