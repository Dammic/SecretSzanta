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
import { setChoiceMode, setChooserPlayer } from '../ducks/playersDuck'
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
            const { chancellorCandidate, timestamp } = payload.data
            this.props.chatActions.addMessage(timestamp, `The president has nominated ${chancellorCandidate} for chancellor.`)
            this.props.chatActions.addMessage(timestamp, `Voting phase has begun - vote for the new parliment!`)
            this.props.roomActions.changeGamePhase(GamePhases.GAME_PHASE_VOTING)
            this.props.playersActions.setChooserPlayer('')
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
            this.props.chatActions.addMessage(timestamp, `${presidentName} is now choosing a new chancellor...`)
            this.props.playersActions.setChooserPlayer(presidentName)
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode(true, ChoiceModeContexts.ChancellorChoice, playersChoices)
            }
        })
        socket.on(SocketEvents.BECOME_FACIST, (payload) => {
            const { facists } = payload.data
            this.props.roomActions.revealFacists(facists)
        })
        socket.on(SocketEvents.VOTING_PHASE_NEWVOTE, (payload) => {
            const { playerName, remaining, timestamp } = payload.data
            this.props.roomActions.registerVote(playerName)
            this.props.chatActions.addMessage(timestamp, `${playerName} has voted. ${remaining} ${remaining > 1 ? 'votes' : 'vote'} left...`)
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { votes, timestamp, newChancellor } = payload.data
            this.props.roomActions.revealVotes(votes)
            const votingResultMessage = (newChancellor
                ? `${newChancellor} has become the new chancellor!`
                : 'The proposal has been rejected! The new round beings in 3 seconds...'
            )
            this.props.chatActions.addMessage(timestamp, `Voting completed! ${votingResultMessage}`)
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
        playersActions: bindActionCreators({ setChoiceMode, setChooserPlayer }, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
