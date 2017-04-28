'use strict'
import React from 'react'
import GameListComponent from './GameListComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import GameRoom from '../GameRoom/GameRoom'
import IO from 'socket.io-client'
import {joinRoom} from '../../ducks/userDuck'

export class GameList extends React.PureComponent {

    constructor () {
        super()
        this.socket = IO()
    }

    setRoomName = (event) => {
        const {joinRoom} = this.props.actions
        let roomID = event.target.attributes.getNamedItem('data-roomid').value
        joinRoom(roomID)
    }

    render () {
        const {userName} = this.props
        this.rooms = [
            {
                roomID: 0,
                roomName: 'example',
                playerCount: 10
            },
            {
                roomID: 1,
                roomName: 'Bad Example',
                playerCount: 10
            },
            {
                roomID: 2,
                roomName: 'Wrong GameRoom',
                playerCount: 10
            },
            {
                roomID: 3,
                roomName: 'Do not eneter',
                playerCount: 10
            },
            {
                roomID: 4,
                roomName: 'Private',
                playerCount: 10
            },
            {
                roomID: 5,
                roomName: 'Nope',
                playerCount: 10
            },
            {
                roomID: 6,
                roomName: 'Stay out!',
                playerCount: 10
            }
        ]
        return (roomName
            ? <GameRoom socket={this.socket} /> 
            : <GameListComponent socket={this.socket} userName={userName} rooms={this.rooms} onClick={this.setRoomName} />
        )
    }
}

const mapStateToProps = ({user}) => {
    return {
        userName: user.userName,
        roomName: user.roomName
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({joinRoom}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GameList)