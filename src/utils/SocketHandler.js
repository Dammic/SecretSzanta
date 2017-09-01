import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SocketEvents, GamePhases, ChoiceModeContexts } from '../../Dictionary'
import {
    addPlayer, removePlayer, changeGamePhase, chooseNewChancellor, selectNewPresident,
    toggleChancellorChoiceModal, toggleVotingModal, syncRoomData, revealFacists, registerVote,
    revealVotes,
} from '../ducks/roomDuck'
import * as modalActions from '../ducks/modalDuck'
import { setChoiceMode } from '../ducks/playersDuck'
import { addMessage } from '../ducks/chatDuck'

export let socket

export class SocketHandler extends React.PureComponent {
    componentDidMount() {
        socket = IO()
        socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, (payload) => {
            const { maxPlayers, playersDict, gamePhase } = payload.data
            this.props.roomActions.syncRoomData(maxPlayers, playersDict, gamePhase)
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
            this.props.modalActions.setModal({
                title: 'Vote for your parliment!',
                initialData: {
                    chancellorCandidate,
                },
                componentName: 'VotingModal',
            })
        })
        socket.on(SocketEvents.START_GAME, (payload) => {
            const { playerName, timestamp } = payload.data
            this.props.roomActions.changeGamePhase(GamePhases.START_GAME)
            this.props.chatActions.addMessage(timestamp, `${playerName} has started the game.`)
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { newChancellor } = payload.data
            if (newChancellor) {
                this.props.roomActions.chooseNewChancellor(newChancellor)
            }
        })
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data

            this.props.roomActions.selectNewPresident(presidentName)
            this.props.chatActions.addMessage(timestamp, `${presidentName} has become the new president!`)
            this.props.roomActions.changeGamePhase(GamePhases.GAME_PHASE_CHANCELLOR_CHOICE)
            this.props.chatActions.addMessage(timestamp, `${presidentName} is now choosing his chancellor...`)
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode(true, ChoiceModeContexts.ChancellorChoice, playersChoices)
            }
        })
        socket.on(SocketEvents.BECOME_FACIST, (payload) => {
            const { facists } = payload.data
            this.props.roomActions.revealFacists(facists)
        })
        socket.on(SocketEvents.VOTING_PHASE_NEWVOTE, (payload) => {
            const { playerName } = payload.data
            this.props.roomActions.registerVote(playerName)
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { votes } = payload.data
            this.props.roomActions.revealVotes(votes)
        })
    }

    render() {
        return null
    }
}

const mapStateToProps = ({ user }) => {
    return {
        userName: user.userName,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({ addPlayer, removePlayer, changeGamePhase, chooseNewChancellor, selectNewPresident,
            toggleChancellorChoiceModal, toggleVotingModal, syncRoomData, revealFacists, registerVote, revealVotes }, dispatch),
        chatActions: bindActionCreators({ addMessage }, dispatch),
        playersActions: bindActionCreators({ setChoiceMode }, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
