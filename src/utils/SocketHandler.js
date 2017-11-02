import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SocketEvents, GamePhases, ChoiceModeContexts, PlayerAffilications, PolicyCards, MessagesTypes } from '../../Dictionary'
import * as roomActions from '../ducks/roomDuck'
import * as modalActions from '../ducks/modalDuck'
import * as userActions from '../ducks/userDuck' 
import { setChoiceMode, setChooserPlayer } from '../ducks/playersDuck'
import { addMessage } from '../ducks/chatDuck'
import { addNotification } from '../ducks/notificationsDuck'

export let socket

export class SocketHandler extends React.PureComponent {
    componentDidMount() {
        socket = IO()
        socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, (payload) => {
            this.props.roomActions.syncRoomData(payload.data)
        })
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, (payload) => {
            const { player, timestamp } = payload.data
            this.props.chatActions.addMessage({ timestamp, content: `${player.playerName} has joined the room!` })
            player.affiliation = PlayerAffilications.LIBERAL_AFFILIATION
            this.props.roomActions.addPlayer({ player })
        })
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, (payload) => {
            const { playerName, timestamp } = payload.data
            this.props.chatActions.addMessage({ timestamp, content: `${playerName} has left the room!` })
            this.props.roomActions.removePlayer({ playerName })
        })
        socket.on(SocketEvents.CLIENT_SEND_MESSAGE, (payload) => {
            this.props.chatActions.addMessage(payload.data)
        })
        socket.on(SocketEvents.VOTING_PHASE_START, (payload) => {
            const { chancellorCandidate, timestamp } = payload.data
            this.props.chatActions.addMessage({ timestamp, content: `The president has nominated ${chancellorCandidate} for chancellor.` })
            this.props.chatActions.addMessage({ timestamp, content: `Voting phase has begun - vote for the new parliment!` })
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.GAME_PHASE_VOTING })
            this.props.playersActions.setChooserPlayer({ playerName: '' })
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
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.START_GAME })
            this.props.chatActions.addMessage({ timestamp, content: `${playerName} has started the game.` })
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { newChancellor } = payload.data
            if (newChancellor) {
                this.props.roomActions.chooseNewChancellor({ newChancellor })
            }
        })
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data

            this.props.roomActions.chooseNewPresident({ newPresident: presidentName })
            this.props.roomActions.resetVotes()
            this.props.chatActions.addMessage({ timestamp, content: `${presidentName} has become the new president!` })
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.GAME_PHASE_CHANCELLOR_CHOICE })
            this.props.chatActions.addMessage({ timestamp, content: `${presidentName} is now choosing a new chancellor...` })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode({
                    isVisible: true,
                    context: ChoiceModeContexts.ChancellorChoice,
                    selectablePlayers: playersChoices,
                })
            }
        })
        socket.on(SocketEvents.BECOME_FACIST, (payload) => {
            const { facists } = payload.data
            this.props.roomActions.revealFacists({ facists })
        })
        socket.on(SocketEvents.VOTING_PHASE_NEWVOTE, (payload) => {
            const { playerName, remaining, timestamp } = payload.data
            this.props.roomActions.registerVote({ playerName })
            this.props.chatActions.addMessage({ timestamp, content: `${playerName} has voted. ${remaining} ${remaining === 1 ? 'vote' : 'votes'} left...` })
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { votes, timestamp, newChancellor } = payload.data
            this.props.roomActions.revealVotes({ newVotes: votes })
            const votingResultMessage = (newChancellor
                ? `${newChancellor} has become the new chancellor!`
                : 'The proposal has been rejected! The new round beings in 3 seconds...'
            )
            if (!newChancellor) {
                this.props.roomActions.increaseTracker()
                this.props.chatActions.addMessage({ timestamp, content: 'The failed elections tracker has advanced!' })
            }
            this.props.chatActions.addMessage({ timestamp, content: `Voting completed! ${votingResultMessage}` })
        })

        socket.on(SocketEvents.KillSuperpowerUsed, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.GAME_PHASE_SUPERPOWER })
            this.props.chatActions.addMessage({ timestamp, content: `The president has gained enough power to kill a foe! Waiting for ${presidentName} to select the victim...` })
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode({
                    isVisible: true,
                    context: ChoiceModeContexts.KillChoice,
                    selectablePlayers: playersChoices,
                })
            }
        })

        socket.on(SocketEvents.PlayerKilled, (payload) => {
            const { playerName, wasHitler, timestamp } = payload.data
            const killStatusMessage = (wasHitler ? 'Praise to him, because it was Hitler himself he killed!' : 'It turned out the killed foe was not Hitler, unfortunately.')
            this.props.chatActions.addMessage({ timestamp, content: `The president has killed ${playerName}... ${killStatusMessage}` })
            this.props.roomActions.killPlayer({ playerName })
            if (!wasHitler) {
                this.props.chatActions.addMessage({ timestamp, content: 'The next round will begin in 3 seconds...' })
            }
        })
        socket.on(SocketEvents.PlayerKicked, (payload) => {
            const { playerName, banned, timestamp } = payload.data

            if (this.props.userName === playerName) {
                this.props.userActions.joinRoom({ roomName: '' })
                const message = `You have been ${banned ? 'banned' : 'kicked'} by the owner of the room!`
                this.props.notificationsActions.addNotification({ type: MessagesTypes.ERROR, message })
                return
            }
            const message = `${playerName} has been ${banned ? 'banned' : 'kicked'} by the owner`
            this.props.chatActions.addMessage({ timestamp, content: message })
            this.props.roomActions.removePlayer({ playerName })
        })

        socket.on(SocketEvents.GameFinished, (payload) => {
            const { whoWon, facists } = payload.data
            this.props.roomActions.revealFacists({ facists })
            const wonText = whoWon === PlayerAffilications.LIBERAL_AFFILIATION ? 'Liberals won!' : 'Fascist won!'
            this.props.modalActions.setModal({
                title: wonText,
                componentName: 'WinningModal',
                initialData: { whoWon },
            })
        })

        socket.on(SocketEvents.CLIENT_ERROR, (payload) => {
            const { error } = payload
            this.props.notificationsActions.addNotification({ type: MessagesTypes.ERROR,  message: error })
        })

        socket.on(SocketEvents.ChoosePolicy, ({ data: { policyCards, title, role } }) => {
            this.props.modalActions.setModal({
                title,
                initialData: {
                    policies: policyCards,
                    role,
                },
                componentName: 'PolicyChoiceModal',
            })
        })

        socket.on(SocketEvents.PresidentChoosePolicy, ({ data: { timestamp, presidentName } }) => {
            this.props.chatActions.addMessage({ timestamp, content: 'The president is now discarding one policy out of three...' })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            this.props.roomActions.resetVotes()
        })

        socket.on(SocketEvents.ChancellorChoosePolicy, ({ data: { timestamp, chancellorName } }) => {
            this.props.chatActions.addMessage({ timestamp, content: 'The president has discarded one policy. Now the chancellor will enact one of two remaining policies...' })
            this.props.playersActions.setChooserPlayer({ playerName: chancellorName })
        })

        socket.on(SocketEvents.NewPolicy, ({ data: { timestamp, policy } }) => {
            const isFacist = policy === PolicyCards.FacistPolicy
            this.props.playersActions.setChooserPlayer({ playerName: '' })
            this.props.chatActions.addMessage({ timestamp, content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
            this.props.roomActions.increasePolicyCount({ isFacist })
            this.props.chatActions.addMessage({ timestamp, content: 'The next round will begin in 4 seconds...' })
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
        userActions: bindActionCreators(userActions, dispatch),
        chatActions: bindActionCreators({ addMessage }, dispatch),
        playersActions: bindActionCreators({ setChoiceMode, setChooserPlayer }, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
        notificationsActions: bindActionCreators({ addNotification }, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
