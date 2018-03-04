import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { GameEndModalComponent } from './GameEndModalComponent'

class GameEndModal extends PureComponent {
    static propTypes = {
        playersDict: PropTypes.objectOf(PropTypes.any),
    }
    render() {
        return (
            <GameEndModalComponent
                players={this.props.playersDict}
            />
        )
    }
}

const mapStateToProps = ({ room }) => ({
    playersDict: room.playersDict,
})

export default connect(mapStateToProps)(GameEndModal)
