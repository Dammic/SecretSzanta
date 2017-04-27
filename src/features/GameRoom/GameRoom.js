'use strict'
require('../../styles/main.scss')
import React from 'react'
import IO from 'socket.io-client'
import GameRoomComponent from './GameRoomComponent'
import {SocketEvents} from '../../../Dictionary'

export default class GameRoom extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            maxPlayers: null,
            playersCount: 0,
            slots: [],
            playersList: [],
            chancellorCandidate: null,
            gamePhase: '',
            president: '',
            chancellor: '',
            isChancellorChoiceShown: false,
            potentialChancellorsChoices: []
        }

        props.socket.emit(SocketEvents.CLIENT_CREATE_ROOM, { playerName: this.props.userName, roomName: 'example' })
        props.socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { playerName: this.props.userName, roomName: 'example' })
        props.socket.on(SocketEvents.CLIENT_GET_ROOM_DATA, (data) => {
            const {maxPlayers, playersCount, slots, playersList, chancellorCandidate, gamePhase} = data
            this.setState({
                maxPlayers,
                playersCount,
                slots,
                playersList,
                gamePhase,
                chancellorCandidate
            })
        })
        props.socket.on(SocketEvents.CLIENT_JOIN_ROOM, (data) => {
            const {playerName, playerInfo} = data
            const {playersList, slots, playersCount} = this.state

            const newSlots = [...slots]
            newSlots[playerInfo.slotID - 1] = playerInfo
            this.setState({
                slots: newSlots,
                playersList: [...playersList, {playerName: playerName, avatarNumber: playerInfo.avatarNumber} ],
                playersCount: playersCount + 1
            })
        })
        props.socket.on(SocketEvents.CLIENT_LEAVE_ROOM, (data) => {
            const {playerName, slotID} = data
            const {playersList, slots, playersCount} = this.state

            let newSlots = [...slots]
            newSlots[slotID - 1].player = null
            const newPlayersList = playersList.filter((player) => {
                return (player.playerName !== playerName)
            })

            this.setState({
                playersList: newPlayersList,
                slots: newSlots,
                playersCount: playersCount - 1
            })
        })

        props.socket.on(SocketEvents.VOTING_PHASE_START, ({chancellorCandidate}) => {
            this.setState({
                isVotingModalShown: true,
                chancellorCandidate: chancellorCandidate,
                gamePhase: 'GAME_PHASE_VOTING'
            })
        })

        props.socket.on(SocketEvents.START_GAME, ({gamePhase}) => {
            this.setState({
                gamePhase
            })
        })

        props.socket.on(SocketEvents.VOTING_PHASE_REVEAL, ({newChancellor}) => {
            if(newChancellor) {
                this.setState({
                    chancellor: newChancellor
                })
            }
        })

        props.socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, ({president, playersChoices}) => {
            const {userName} = this.props
            this.setState({president})
            if(president.playerName === userName) {
                this.setState({
                    isChancellorChoiceShown: true,
                    potentialChancellorsChoices: playersChoices
                })
            }
        })
        
    }

    onChancellorChoiceHide = () => {
        this.setState({isChancellorChoiceShown: false})
    }

    hideVotingModal = () => {
        this.setState({isVotingModalShown: false})
    }

    render () {
        const {userName, socket} = this.props
        const {playersList, isVotingModalShown, gamePhase, president, chancellor, isChancellorChoiceShown, potentialChancellorsChoices, chancellorCandidate} = this.state
        console.info('Current game phase: ', gamePhase)
        return (
            <GameRoomComponent
                socket={socket}
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
