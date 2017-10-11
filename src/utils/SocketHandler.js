import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SocketEvents, GamePhases, ChoiceModeContexts, PlayerAffilications } from '../../Dictionary'
import * as roomActions from '../ducks/roomDuck'
import * as modalActions from '../ducks/modalDuck'
import { setChoiceMode, setChooserPlayer } from '../ducks/playersDuck'
import { addMessage } from '../ducks/chatDuck'
import { addInformation, addError } from '../ducks/notificationsDuck'

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
            player.affiliation = PlayerAffilications.LIBERAL_AFFILIATION
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
            if (!this.props.playersDict[this.props.userName].isDead) {
                this.props.modalActions.setModal({
                    title: 'Vote for your parliment!',
                    initialData: {
                        chancellorCandidate,
                    },
                    componentName: 'VotingModal',
                })
            }
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
            this.props.chatActions.addMessage(timestamp, `${playerName} has voted. ${remaining} ${remaining === 1 ? 'vote' : 'votes'} left...`)
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { votes, timestamp, newChancellor } = payload.data
            this.props.roomActions.revealVotes(votes)
            const votingResultMessage = (newChancellor
                ? `${newChancellor} has become the new chancellor!`
                : 'The proposal has been rejected! The new round beings in 3 seconds...'
            )
            if (!newChancellor) this.props.roomActions.increaseTracker()
            this.props.chatActions.addMessage(timestamp, `Voting completed! ${votingResultMessage}`)
        })

        socket.on(SocketEvents.KillSuperpowerUsed, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data
            this.props.roomActions.changeGamePhase(GamePhases.GAME_PHASE_SUPERPOWER)
            this.props.chatActions.addMessage(timestamp, `The president has gained enough power to kill a foe! Waiting for ${presidentName} to select the victim...`)
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode(true, ChoiceModeContexts.KillChoice, playersChoices)
            }
        })

        socket.on(SocketEvents.PlayerKilled, (payload) => {
            const { playerName, wasHitler, timestamp } = payload.data
            const killStatusMessage = (wasHitler ? 'Praise to him, because it was Hitler himself he killed!' : 'It turned out the killed foe was not Hitler, unfortunately.')
            this.props.chatActions.addMessage(timestamp, `The president has killed ${playerName}... ${killStatusMessage}`)
            this.props.roomActions.killPlayer(playerName)
            if (!wasHitler) {
                this.props.chatActions.addMessage(timestamp, 'The next round will begin in 3 seconds...')
            }
        })

        socket.on(SocketEvents.GameFinished, (payload) => {
            const { whoWon, facists } = payload.data
            this.props.roomActions.revealFacists(facists)
            console.info(whoWon + ' won!');
            this.props.modalActions.setModal({
                title: 'You won!',
                componentName: 'WinningModal',
                initialData: { whoWon },
            })
        })

        socket.on(SocketEvents.CLIENT_ERROR, (payload) => {
            const { error } = payload
            this.props.notificationsActions.addError(error)
        })
    }

    render() {
        return null
    }
}

const mapStateToProps = ({ user, room }) => {
    return {
        userName: user.userName,
        playersDict: room.playersDict,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators(roomActions, dispatch),
        chatActions: bindActionCreators({ addMessage }, dispatch),
        playersActions: bindActionCreators({ setChoiceMode, setChooserPlayer }, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
        notificationsActions: bindActionCreators({ addInformation, addError }, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
