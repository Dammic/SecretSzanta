'use strict'
require('../../styles/main.scss')
import React from 'react'
import IO from 'socket.io-client'
import MainPageComponent from './MainPageComponent'
import {CLIENT_JOIN_ROOM, CLIENT_LEAVE_ROOM, CLIENT_GET_ROOM_DATA, CLIENT_CREATE_ROOM} from '../../const/SocketEvents'

export default class MainPage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            maxPlayers: null,
            playersCount: 0,
            slots: [],
            playersList: []
        }

        props.socket.emit(CLIENT_CREATE_ROOM, { playerName: this.props.userName, roomName: 'example' })
        props.socket.emit(CLIENT_JOIN_ROOM, { playerName: this.props.userName, roomName: 'example' })
        props.socket.on(CLIENT_GET_ROOM_DATA, (data) => {
            const {maxPlayers, playersCount, slots, playersList} = data
            this.setState({
                maxPlayers,
                playersCount,
                slots,
                playersList
            })
        })
        props.socket.on(CLIENT_JOIN_ROOM, (data) => {
            console.info(data)
            const {playerName, playerInfo} = data
            const {playersList, slots, playersCount} = this.state

            const newSlots = [...slots]
            newSlots[playerInfo.slotID - 1] = playerInfo

            this.setState({
                slots: newSlots,
                playersList: [...playersList, playerName ],
                playersCount: playersCount + 1
            })
        })
        props.socket.on(CLIENT_LEAVE_ROOM, (data) => {
            const {playerName, slotID} = data
            const {playersList, slots, playersCount} = this.state

            let newSlots = [...slots]
            newSlots[slotID - 1].player = null
            const newPlayersList = playersList.filter((player) => {
                return (player !== playerName)
            })

            this.setState({
                playersList: newPlayersList,
                slots: newSlots,
                playersCount: playersCount - 1
            })
        })
    }

    render () {
        const {userName} = this.props
        const {playersList} = this.state
        return (
            <MainPageComponent
                socket={this.socket}
                userName={userName}
                playersList={playersList}/>
        )
    }
}
