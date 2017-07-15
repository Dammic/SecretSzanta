'use strict'
import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SocketEvents, GamePhases, PlayerRole } from '../../Dictionary'
import { addPlayer, removePlayer, changeGamePhase, chooseNewChancellor, selectNewPresident, toggleChancellorChoiceModal, toggleVotingModal, syncRoomData, revealFacists } from '../ducks/roomDuck'
import { addMessage } from '../ducks/chatDuck';

export let socket

export class SocketHandler extends React.PureComponent {
    componentDidMount() {
        socket = IO()
        socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, (payload) => {
            const { maxPlayers, playersDict, gamePhase, chancellorCandidate } = payload.data
            this.props.roomActions.syncRoomData(maxPlayers, playersDict, gamePhase, chancellorCandidate)
        })
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, (payload) => {
            const { player, timestamp } = payload.data
            this.props.chatActions.addMessage(timestamp, `${player.playerName} has joined the room!`)
            this.props.roomActions.addPlayer(player)
        })
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, (payload) => {
            const { playerName, timestamp } = payload.data
            this.props.chatActions.addMessage(timestamp, `${playerName} has left the room!`)
            this.props.roomActions.removePlayer(playerName)
        })
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, (payload) => {
            const { timestamp, content, author } = payload.data
            this.props.chatActions.addMessage(timestamp, content, author)
        })
        socket.on(SocketEvents.VOTING_PHASE_START, (payload) => {
            const { chancellorCandidate } = payload.data
            this.props.roomActions.toggleVotingModal(true, chancellorCandidate)
        })
        socket.on(SocketEvents.START_GAME, () => {
            this.props.roomActions.changeGamePhase(GamePhases.START_GAME)
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { newChancellor } = payload.data
            if (newChancellor) {
                this.props.roomActions.chooseNewChancellor(newChancellor)
            }
        })
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, (payload) => {
            const { presidentName, playersChoices } = payload.data

            this.props.roomActions.selectNewPresident(presidentName)
            this.props.roomActions.changeGamePhase(GamePhases.GAME_PHASE_CHANCELLOR_CHOICE)
            if (presidentName === this.props.userName) {
                this.props.roomActions.toggleChancellorChoiceModal(true, playersChoices);
            }
        })
        socket.on(SocketEvents.BECOME_FACIST, (payload) => {
            const { facists } = payload.data
            this.props.roomActions.revealFacists(facists);
        })
    }

    render () {
        return null;
    }
}

const mapStateToProps = ({ user, room }) => {
    return {
        userName: user.userName,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({addPlayer, removePlayer, changeGamePhase, chooseNewChancellor, selectNewPresident, toggleChancellorChoiceModal, toggleVotingModal, syncRoomData, revealFacists }, dispatch),
        chatActions: bindActionCreators({addMessage}, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
