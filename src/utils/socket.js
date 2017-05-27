'use strict'
import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {SocketEvents, GamePhases} from '../../Dictionary'
import {addPlayer, removePlayer, changeGamePhase, chooseNewChancellor, selectNewPresident, toggleChancellorChoiceModal, toggleVotingModal, syncRoomData} from '../ducks/roomDuck'
import {addMessage} from '../ducks/chatDuck';

export let socket

export class SocketHandler extends React.PureComponent {
    componentDidMount() {
        socket = IO()
        socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, ({maxPlayers, playersCount, slots, playersList, gamePhase, chancellorCandidate}) => {
            this.props.roomActions.syncRoomData(maxPlayers, playersCount, slots, playersList, gamePhase, chancellorCandidate)
        })
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, ({playerInfo, timestamp, playerName}) => {
            this.props.chatActions.addMessage(timestamp, `${playerName} has joined the room!`)
            this.props.roomActions.addPlayer(playerInfo)
        })
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, ({playerName, slotID, timestamp}) => {
            this.props.chatActions.addMessage(timestamp, `${playerName} has left the room!`)
            this.props.roomActions.removePlayer(playerName, slotID)
        })
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, ({timestamp, content, author}) => {
            this.props.chatActions.addMessage(timestamp, content, author)
        })
        socket.on(SocketEvents.VOTING_PHASE_START, ({chancellorCandidate}) => {
            this.props.roomActions.toggleVotingModal(true, chancellorCandidate)
        })
        socket.on(SocketEvents.START_GAME, () => {
            this.props.roomActions.changeGamePhase(GamePhases.START_GAME)
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, ({newChancellor}) => {
            if(newChancellor) {
                this.props.roomActions.chooseNewChancellor(newChancellor)
            }
        })
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, ({president, playersChoices}) => {
            this.props.roomActions.selectNewPresident(president)
            this.props.roomActions.changeGamePhase(GamePhases.GAME_PHASE_CHANCELLOR_CHOICE)
            if(this.props.president.playerName === this.props.userName) {
                this.props.roomActions.toggleChancellorChoiceModal(true, playersChoices);
            }
        })
    }

    render () {
        return null;
    }
}

const mapStateToProps = ({user, room}) => {
    return {
        userName: user.userName,
        president: room.president
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({addPlayer, removePlayer, changeGamePhase, chooseNewChancellor, selectNewPresident, toggleChancellorChoiceModal, toggleVotingModal, syncRoomData}, dispatch),
        chatActions: bindActionCreators({addMessage}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)