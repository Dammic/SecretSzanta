'use strict'
import React from 'react'
import UIBoxComponent from './UIBoxComponent'
import {SocketEvents} from '../../../Dictionary'

export default class UIBox extends React.PureComponent {

    onStartVote = () => {
        this.props.socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE, { })
    }

    onStartGame = () => {
        this.props.socket.emit(SocketEvents.START_GAME, { })
    }

    render () {
        const {socket, userName} = this.props
        return (
            <UIBoxComponent socket={socket} userName={userName} onStartVote={this.onStartVote} onStartGame={this.onStartGame}/>
        )
    }
}
