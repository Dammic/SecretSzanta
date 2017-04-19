'use strict'
import React from 'react'
import UIBoxComponent from './UIBoxComponent'
import {VOTING_PHASE_START, START_GAME} from '../../const/SocketEvents'

export default class UIBox extends React.PureComponent {

    onStartVote = () => {
        this.props.socket.emit(VOTING_PHASE_START, { chancellorName: 'b' /*temporary*/ })
    }

    onStartGame = () => {
        this.props.socket.emit(START_GAME, { })
    }

    render () {
        const {socket, userName} = this.props
        return (
            <UIBoxComponent socket={socket} userName={userName} onStartVote={this.onStartVote} onStartGame={this.onStartGame}/>
        )
    }
}
