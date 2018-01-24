import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SocketEvents, GamePhases, ChoiceModeContexts, PlayerAffilications, PolicyCards, MessagesTypes, Views } from '../../Dictionary'
import * as roomActions from '../ducks/roomDuck'
import * as modalActions from '../ducks/modalDuck'
import * as userActions from '../ducks/userDuck'
import * as lobbyActions from '../ducks/lobbyDuck'
import { setChoiceMode, setChooserPlayer, hideChoiceMode } from '../ducks/playersDuck'
import { addMessage, clearChat } from '../ducks/chatDuck'
import { addNotification } from '../ducks/notificationsDuck'

export let socket

export class SocketHandler extends React.PureComponent {
    componentDidMount() {
        socket = IO()
        socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, (payload) => {
            this.props.roomActions.syncRoomData(payload.data)
            if (payload.data.gamePhase === GamePhases.Paused) {
                this.props.modalActions.setModal({
                    title: 'The game in this room has been paused by the owner',
                    isOverlayOpaque: true,
                    componentName: 'HaltModal',
                    initialData: { hasGameEnded: false },
                })
            }
        })
        socket.on(SocketEvents.AllowEnteringRoom, (payload) => {
            const { roomName } = payload.data
            this.switchRooms(roomName)
        })
        socket.on(SocketEvents.ServerWaitingForVeto, (payload) => {
            this.props.roomActions.setVeto({ value: true })
        })
        socket.on(SocketEvents.CLIENT_JOIN_ROOM, (payload) => {
            const { player, timestamp } = payload.data
            player.affiliation = PlayerAffilications.LIBERAL_AFFILIATION
            this.props.roomActions.addPlayer({ player })
        })
        socket.on(SocketEvents.CLIENT_LEAVE_ROOM, (payload) => {
            const { playerName, timestamp } = payload.data
            this.props.roomActions.removePlayer({ playerName })

            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.Paused })
            this.cancelEveryGameChoice()
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
            const { playerName, timestamp, boardType } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.START_GAME })
            this.props.roomActions.setBoardType({ newBoardType: boardType })
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
            this.props.roomActions.setVeto({ value: false })
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
        })

        socket.on(SocketEvents.IncreaseTrackerPosition, (payload) => {
            this.props.roomActions.increaseTracker()
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

        socket.on(SocketEvents.DesignateNextPresident, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.DesignateNextPresidentPhase })
            this.props.chatActions.addMessage({ timestamp, content: 'Because 3 fascist policies have been enacted, the president will now choose its successor...' })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode({
                    isVisible: true,
                    context: ChoiceModeContexts.DesignateNextPresidentChoice,
                    selectablePlayers: playersChoices,
                })
            }
        })

        socket.on(SocketEvents.PlayerKilled, (payload) => {
            const { playerName, wasHitler, timestamp } = payload.data
            const killStatusMessage = (wasHitler ? 'Praise to him, because it was Hitler himself he killed!' : 'It turned out the killed foe was not Hitler, unfortunately.')
            this.props.chatActions.addMessage({ timestamp, content: `The president has killed ${playerName}... ${killStatusMessage}` })
            this.props.roomActions.killPlayer({ playerName })
        })
        socket.on(SocketEvents.PlayerKicked, (payload) => {
            const { playerName, isOverlaysHidingNeeded, wasBanned, timestamp } = payload.data

            if (this.props.userName === playerName) {
                const message = `You have been ${wasBanned ? 'banned' : 'kicked'} by the owner of the room!`
                this.props.notificationsActions.addNotification({ type: MessagesTypes.ERROR, message })
                this.props.roomActions.clearRoom()
                this.switchRooms('')
                this.cancelEveryGameChoice()
                return
            }
            const message = `${playerName} has been ${wasBanned ? 'banned' : 'kicked'} by the owner`
            this.props.chatActions.addMessage({ timestamp, content: message })
            this.props.roomActions.removePlayer({ playerName })
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.Paused })

            if (isOverlaysHidingNeeded) this.cancelEveryGameChoice()
            this.props.modalActions.setModal({
                title: message,
                isOverlayOpaque: true,
                componentName: 'HaltModal',
                initialData: { hasGameEnded: false },
            })
        })

        socket.on(SocketEvents.GameFinished, (payload) => {
            const { whoWon, facists } = payload.data

            if (!whoWon) {
                this.props.modalActions.setModal({
                    title: "The game abruptly ended",
                    isOverlayOpaque: true,
                    componentName: 'HaltModal',
                    initialData: { hasGameEnded: true },
                })
                return
            }

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

        socket.on(SocketEvents.ResetTracker, (payload) => {
            const { timestamp, trackerPositionBeforeReset } = payload.data
            let delay = 0
            if (trackerPositionBeforeReset === 3) {
              this.props.roomActions.increaseTracker()
              delay = 4000
            }
            setTimeout(() => {
                this.props.roomActions.resetTracker()
            }, delay)
            // time of delay must be greater that time of an animation of tracker beeing moved
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

        socket.on(SocketEvents.PresidentChoosePolicy, ({ data: { timestamp, presidentName, gamePhase } }) => {
            this.props.roomActions.changeGamePhase({ gamePhase })
            this.props.chatActions.addMessage({ timestamp, content: 'The president is now discarding one policy out of three...' })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            this.props.roomActions.resetVotes()
        })

        socket.on(SocketEvents.ChancellorChoosePolicy, ({ data: { timestamp, chancellorName } }) => {
            this.props.chatActions.addMessage({ timestamp, content: 'The president has discarded one policy. Now the chancellor will enact one of two remaining policies...' })
            this.props.playersActions.setChooserPlayer({ playerName: chancellorName })
        })

        socket.on(SocketEvents.NewPolicy, ({ data: { policy } }) => {
            const isFacist = policy === PolicyCards.FacistPolicy
            this.props.playersActions.setChooserPlayer({ playerName: '' })
            this.props.roomActions.increasePolicyCount({ isFacist })
        })

        socket.on(SocketEvents.SyncPolicies, ({ data: { facist, liberal } }) => {
            this.props.roomActions.setPoliciesCount({ facist, liberal })
        })

        socket.on(SocketEvents.SelectName, ({ data: { userName } }) => {
            this.props.chatActions.clearChat()
            if (userName) {
                this.props.userActions.selectName({ userName })
                this.props.userActions.setView({ viewName: Views.Lobby })
            } else {
                this.props.userActions.selectName({ userName: '' })
                this.props.userActions.setView({ viewName: Views.Home })
            }
        })

        socket.on(SocketEvents.SyncLobby, ({ data: { players, rooms } }) => {
          this.props.lobbyActions.syncLobby({ players, rooms })
        })

        socket.on(SocketEvents.PlayersListChanged, ({ data: { player, playerName } }) => {
            this.props.lobbyActions.changePlayerInPlayersList({ player, playerName })
        })

        socket.on(SocketEvents.RoomsListChanged, ({ data: { room, roomName } }) => {
            this.props.lobbyActions.changeRoomInRoomsList({ room, roomName })
        })
        socket.on(SocketEvents.SetTimer, ({ data: { waitTime } }) => {
            this.props.roomActions.setWaitTime({ waitTime })
        })
        socket.on(SocketEvents.SetChooserPlayer, ({ data: { playerName } }) => {
            this.props.playersActions.setChooserPlayer({ playerName })
        })

    }

    switchRooms = (targetRoomName) => {
        this.props.chatActions.clearChat()
        this.props.userActions.setRoomName({ roomName: targetRoomName || '' })
        this.props.userActions.setView({ viewName: (targetRoomName ? Views.Game : Views.Lobby) })
    }

    cancelEveryGameChoice = () => {
        this.props.playersActions.setChooserPlayer({ playerName: '' })
        this.props.playersActions.hideChoiceMode()
        if (this.props.gamePhase !== GamePhases.Paused) this.props.modalActions.toggleModal({ value: false })
    }


    render() {
        return null
    }
}

const mapStateToProps = ({ user, room }) => {
    return {
        userName: user.userName,
        playersDict: room.playersDict,
        trackerPosition: room.trackerPosition,
        gamePhase: room.gamePhase,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators(roomActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        chatActions: bindActionCreators({ addMessage, clearChat }, dispatch),
        playersActions: bindActionCreators({ setChoiceMode, setChooserPlayer, hideChoiceMode }, dispatch),
        modalActions: bindActionCreators(modalActions, dispatch),
        notificationsActions: bindActionCreators({ addNotification }, dispatch),
        lobbyActions: bindActionCreators(lobbyActions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
