'use strict'
require('../../styles/main.scss')
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import GameRoomComponent from './GameRoomComponent'
import {SocketEvents} from '../../../Dictionary'
import {socket} from '../../utils/socket'

export class GameRoom extends React.PureComponent {
    constructor (props) {
        super(props)
        socket.emit(SocketEvents.CLIENT_CREATE_ROOM, { playerName: props.userName, roomName: 'example' })
        socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { playerName: props.userName, roomName: 'example' })
    }

    render () {
        console.info('Current game phase: ', this.props.gamePhase)
        return (
            <GameRoomComponent />
        )
    }
}

const mapStateToProps = ({user, room}) => {
    return {
        userName: user.userName,
        gamePhase: room.gamePhase
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GameRoom)
