'use strict'
import React from 'react'
import GameListComponent from './GameListComponent'
import MainPage from '../MainPage/MainPage'
import {testMock} from '../../const/testMock'

export default class GameList extends React.PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            roomName: ''
        }
        this.setRoomName = this.setRoomName.bind(this)
    }

    setRoomName (event) {
        // const {target} = event
        // const {roomid} = target.attributes
        console.log(event.target.attributes.getNamedItem('data-roomid').value)
        var roomID = event.target.attributes.getNamedItem('data-roomid').value

        this.setState({
            roomName: roomID
        })
        console.log('processed')
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
                roomName: 'Wrong Room',
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

        if (roomName === '')
            return (
                <GameListComponent title={userName} userNames={testMock} rooms={this.rooms} onClick={this.setRoomName} />
            )
        else
            return (
                <MainPage userName={userName}/>
            )
    }
}
