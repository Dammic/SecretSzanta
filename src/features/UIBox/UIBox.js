'use strict'
import React from 'react'
import UIBoxComponent from './UIBoxComponent'
import {VOTING_PHASE_START} from '../../const/SocketEvents'

export default class UIBox extends React.PureComponent {

    onStartVote = () => {
        this.props.socket.emit(VOTING_PHASE_START, { chancellorName: 'b' /*temporary*/ })
    }

    render () {
        const {socket, userName} = this.props
        return (
            <UIBoxComponent socket={socket} userName={userName} onStartVote={this.onStartVote}/>
        )
    }
}
