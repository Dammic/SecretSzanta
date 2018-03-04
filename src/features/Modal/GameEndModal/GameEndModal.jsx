import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GameEndModalComponent from './GameEndModalComponent'

// eslint-disable-next-line
class GameEndModal extends PureComponent {
    static propTypes = {
        playerDict: PropTypes.objectOf(PropTypes.any),
    }
    render = () => (
        <GameEndModalComponent
            players={this.props.playerDict}
        />
    )
}

const mapStateToProps = ({ room }) => ({
    playersDict: room.playersDict,
})

export default connect(mapStateToProps)(GameEndModal)
