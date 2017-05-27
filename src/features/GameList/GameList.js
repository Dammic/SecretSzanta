'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import GameListComponent from './GameListComponent'
import GameRoom from '../GameRoom/GameRoom'
import {joinRoom} from '../../ducks/userDuck'
import SocketHandler from '../../utils/socket'

export class GameList extends React.PureComponent {

    constructor (props) {
        super(props)
    }

    setRoomName = (event) => {
        let roomID = event.target.attributes.getNamedItem('data-roomid').value
        this.props.userActions.joinRoom(roomID)
    }

    render () {
        const {userName, roomName} = this.props
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
        return (
            <div>
                <SocketHandler />
                {roomName
                    ? <GameRoom />
                    : <GameListComponent userName={userName} rooms={this.rooms} onClick={this.setRoomName} />
                }
            </div>
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
        userActions: bindActionCreators({joinRoom}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GameList)
