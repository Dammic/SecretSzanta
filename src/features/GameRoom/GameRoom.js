'use strict'
require('../../styles/main.scss')
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import IO from 'socket.io-client'
import GameRoomComponent from './GameRoomComponent'
import {SocketEvents, GamePhases} from '../../../Dictionary'
import {socket} from '../../utils/socket'
import {dispatchAction} from '../../utils/utils'

export class GameRoom extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            isChancellorChoiceShown: false,
            isVotingModalShown: false
        }

        socket.emit(SocketEvents.CLIENT_CREATE_ROOM, { playerName: props.userName, roomName: 'example' })
        socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { playerName: props.userName, roomName: 'example' })

    }

    onChancellorChoiceHide = () => {
        this.setState({isChancellorChoiceShown: false})
    }

    hideVotingModal = () => {
        this.setState({isVotingModalShown: false})
    }

    render () {
        const {isVotingModalShown, isChancellorChoiceShown} = this.state
        const {userName, playersList, gamePhase, president, chancellor, potentialChancellorsChoices, chancellorCandidate} = this.props
        console.info('Current game phase: ', gamePhase)
        return (
            <GameRoomComponent
                userName={userName}
                playersList={playersList}
                gamePhase={gamePhase}
                isVotingModalShown={isVotingModalShown}
                onVotingModalHide={this.hideVotingModal}
                president={president}
                chancellor={chancellor}
                onChancellorChoiceHide = {this.onChancellorChoiceHide}
                isChancellorChoiceShown = {isChancellorChoiceShown}
                potentialChancellorsChoices = {potentialChancellorsChoices}
                chancellorCandidate = {chancellorCandidate}
            />
        )
    }
}

const mapStateToProps = ({user, room}) => {
    return {
        userName: user.userName,
        maxPlayers: room.maxPlayers,
        playersCount: room.playerCount,
        slots: room.slots,
        playersList: room.playersList,
        chancellorCandidate: room.chancellorCandidate,
        gamePhase: room.gamePhase,
        president: room.president,
        chancellor: room.chancellor,
        isChancellorChoiceShown: room.isChancellorChoiceShown,
        potentialChancellorsChoices: room.potentialChancellorsChoices

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({dispatchAction}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GameRoom)