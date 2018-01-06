import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GameRoomComponent from './GameRoomComponent'

export class GameRoom extends React.PureComponent {
    static propTypes = {
        // redux
        gamePhase: PropTypes.string,
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    render() {
        console.info('Current game phase: ', this.props.gamePhase)
        return <GameRoomComponent />
    }
}

const mapStateToProps = ({ room }) => ({
    gamePhase: room.gamePhase,
})
export default connect(mapStateToProps)(GameRoom)
