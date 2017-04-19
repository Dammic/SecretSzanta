'use strict'
import React from 'react'
import GameListComponent from './GameListComponent'
import GameRoom from '../GameRoom/GameRoom'
import IO from 'socket.io-client'

export default class GameList extends React.PureComponent {

    constructor () {
        super()
        this.socket = IO()
        this.state = {
            roomName: ''
        }
    }

    setRoomName = (event) => {
        let roomID = event.target.attributes.getNamedItem('data-roomid').value

        this.setState({
            roomName: roomID
        })
    }

    render () {
        const {userName} = this.props
        const {roomName} = this.state
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

        if (roomName === '') {
            return (
                <div>
                    <GameListComponent socket={this.socket} userName={userName} rooms={this.rooms} onClick={this.setRoomName} />
                </div>
            )
        } else {
            return (
                <GameRoom socket={this.socket} userName={userName}/>
            )
        }
    }
}
