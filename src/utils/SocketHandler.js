import IO from 'socket.io-client'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    SocketEvents,
    GamePhases,
    ChoiceModeContexts,
    PlayerAffilications,
    PolicyCards,
    MessagesTypes,
    Views,
} from '../../Dictionary'
import { store } from '../store'
import * as roomActions from '../ducks/roomDuck'
import * as modalActions from '../ducks/modalDuck'
import * as userActions from '../ducks/userDuck'
import * as lobbyActions from '../ducks/lobbyDuck'
import { setChoiceMode, setChooserPlayer, hideChoiceMode } from '../ducks/playersDuck'
import { addMessage, clearChat } from '../ducks/chatDuck'
import { addNotification } from '../ducks/notificationsDuck'
import { logoutUser } from '../ducks/rootDuck'

export let socket = {}

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
        socket.on(SocketEvents.ClientGameNotification, (payload) => {
            const { type, message, values } = payload.data
            this.props.notificationsActions.addNotification({ type, message, values })
        })
        socket.on(SocketEvents.VOTING_PHASE_START, (payload) => {
            const { chancellorCandidate, timestamp } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.GAME_PHASE_VOTING })
            this.cancelEveryGameChoice()

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
            const { boardType } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.START_GAME })
            this.props.roomActions.setBoardType({ newBoardType: boardType })
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { newChancellor } = payload.data
            if (newChancellor) {
                this.props.roomActions.chooseNewChancellor({ newChancellor })
            }
        })
        socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, (payload) => {
            const { presidentName, playersChoices } = payload.data

            this.props.roomActions.chooseNewPresident({ newPresident: presidentName })
            this.props.roomActions.setVeto({ value: false })
            this.props.roomActions.resetVotes()
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.GAME_PHASE_CHANCELLOR_CHOICE })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode({
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
            const { playerName } = payload.data
            this.props.roomActions.registerVote({ playerName })
        })
        socket.on(SocketEvents.VOTING_PHASE_REVEAL, (payload) => {
            const { votes } = payload.data
            this.props.roomActions.revealVotes({ newVotes: votes })
        })

        socket.on(SocketEvents.IncreaseTrackerPosition, (payload) => {
            this.props.roomActions.increaseTracker()
        })

        socket.on(SocketEvents.KillSuperpowerUsed, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.GAME_PHASE_SUPERPOWER })
            // TODO: Put logic related to president choose into other Event
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode({
                    context: ChoiceModeContexts.KillChoice,
                    selectablePlayers: playersChoices,
                })
            }
        })

        socket.on(SocketEvents.DesignateNextPresident, (payload) => {
            const { presidentName, playersChoices, timestamp } = payload.data
            this.props.roomActions.changeGamePhase({ gamePhase: GamePhases.DesignateNextPresidentPhase })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            if (presidentName === this.props.userName) {
                this.props.playersActions.setChoiceMode({
                    context: ChoiceModeContexts.DesignateNextPresidentChoice,
                    selectablePlayers: playersChoices,
                })
            }
        })

        socket.on(SocketEvents.PlayerKilled, (payload) => {
            const { playerName } = payload.data
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
  
            this.props.roomActions.revealFacists({ facists })

            if (!whoWon) {
                this.props.modalActions.setModal({
                    title: 'The game abruptly ended',
                    isOverlayOpaque: true,
                    componentName: 'GameEndModal',
                })
                return
            }

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
            console.log(this.props)
            const trackerPositionBeforeReset = this.props.room.trackerPosition
            if (trackerPositionBeforeReset === 3) {
                this.props.roomActions.increaseTracker()

                // time of delay must be greater that time of an animation of tracker beeing moved
                setTimeout(() => {
                    this.props.roomActions.resetTracker()
                }, 4000)
            } else {
                this.props.roomActions.resetTracker()
            }
        })

        socket.on(SocketEvents.ChoosePolicy, ({ data: { policyCards, title } }) => {
            this.props.modalActions.setModal({
                title,
                initialData: {
                    policies: policyCards,
                },
                componentName: 'PolicyChoiceModal',
            })
        })

        socket.on(SocketEvents.PresidentChoosePolicy, ({ data: { timestamp, presidentName, gamePhase } }) => {
            this.props.roomActions.changeGamePhase({ gamePhase })
            this.props.playersActions.setChooserPlayer({ playerName: presidentName })
            this.props.roomActions.resetVotes()
        })

        socket.on(SocketEvents.ChancellorChoosePolicy, ({ data: { timestamp, chancellorName } }) => {
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

        socket.on(SocketEvents.SuperpowerAffiliationPeekPlayerChoose, ({ data: { playersChoices } }) => {
            this.props.playersActions.setChoiceMode({
                context: ChoiceModeContexts.AffiliationPeekChoice,
                selectablePlayers: playersChoices,
            })
        })
        socket.on(SocketEvents.SuperpowerAffiliationPeekAffiliationReveal, ({ data: { playerInfo } }) => {
            this.props.modalActions.setModal({
                title: 'This is the selected player affiliation',
                isOverlayOpaque: true,
                componentName: 'PeekAffiliationModal',
                initialData: { playerInfo },
            })
        })
        socket.on(SocketEvents.PeekCards, ({ data: { cards } }) => {
            this.props.modalActions.setModal({
                title: 'Those are the cards the next president will draw',
                initialData: {
                    policies: cards,
                    selectable: false,
                },
                componentName: 'PolicyChoiceModal',
            })
        })
        socket.on(SocketEvents.SetChooserPlayer, ({ data: { playerName } }) => {
            this.props.playersActions.setChooserPlayer({ playerName })
        })
        socket.on(SocketEvents.logoutPlayer, ({ data: { message } }) => {
            this.props.rootActions.logoutUser()
            this.props.notificationsActions.addNotification({ type: MessagesTypes.ERROR, message: message || 'You have been logged out!' })
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
        room,
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
        rootActions: bindActionCreators({ logoutUser }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SocketHandler)
