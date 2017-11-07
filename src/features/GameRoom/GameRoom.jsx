import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GameRoomComponent from './GameRoomComponent'
import { SocketEvents } from '../../../Dictionary'
import { socket } from '../../utils/SocketHandler'

export class GameRoom extends React.PureComponent {
    static propTypes = {
        // redux
        userName: PropTypes.string,
        gamePhase: PropTypes.string,
    }

    constructor(props) {
        super(props)
        socket.emit(SocketEvents.CLIENT_CREATE_ROOM, { playerName: props.userName, roomName: 'example' })
        socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { playerName: props.userName, roomName: 'example' })
    }

    render() {
        console.info('Current game phase: ', this.props.gamePhase)
        return <GameRoomComponent />
    }
}

const mapStateToProps = ({ user, room }) => ({
    userName: user.userName,
    gamePhase: room.gamePhase,
})
const mapDispatchToProps = dispatch => ({
    roomActions: bindActionCreators({}, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameRoom)
