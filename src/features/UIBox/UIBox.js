'use strict'
import React from 'react'
import UIBoxComponent from './UIBoxComponent'
import {SocketEvents} from '../../../Dictionary'
import {socket} from '../../utils/socket'

export default class UIBox extends React.PureComponent {

    onStartVote = () => {
        socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE, { })
    }

    onStartGame = () => {
        socket.emit(SocketEvents.START_GAME, { })
    }

    render () {
        const {userName} = this.props
        return (
            <UIBoxComponent userName={userName} onStartVote={this.onStartVote} onStartGame={this.onStartGame}/>
        )
    }
}
