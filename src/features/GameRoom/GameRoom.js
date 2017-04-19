'use strict'
require('../../styles/main.scss')
import React from 'react'
import IO from 'socket.io-client'
import GameRoomComponent from './GameRoomComponent'
import {CLIENT_JOIN_ROOM, CLIENT_LEAVE_ROOM, CLIENT_GET_ROOM_DATA, CLIENT_CREATE_ROOM, VOTING_PHASE_START, VOTING_PHASE_REVEAL, START_GAME, CHANCELLOR_CHOICE_PHASE} from '../../const/SocketEvents'

export default class GameRoom extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            maxPlayers: null,
            playersCount: 0,
            slots: [],
            playersList: [],
            chancellorCandidateName: '',
            gamePhase: '',
            presidentName: '',
            chancellorName: '',
            isChancellorChoiceShown: false,
            potentialChancellorsChoices: []
        }

        props.socket.emit(CLIENT_CREATE_ROOM, { playerName: this.props.userName, roomName: 'example' })
        props.socket.emit(CLIENT_JOIN_ROOM, { playerName: this.props.userName, roomName: 'example' })
        props.socket.on(CLIENT_GET_ROOM_DATA, (data) => {
            const {maxPlayers, playersCount, slots, playersList, chancellorCandidateName, gamePhase} = data
            this.setState({
                maxPlayers,
                playersCount,
                slots,
                playersList,
                gamePhase,
                chancellorCandidateName
            })
        })
        props.socket.on(CLIENT_JOIN_ROOM, (data) => {
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
        props.socket.on(CLIENT_LEAVE_ROOM, (data) => {
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

        props.socket.on(VOTING_PHASE_START, ({chancellorName}) => {
            this.setState({
                isVotingModalShown: true,
                chancellorCandidateName: chancellorName,
                gamePhase: 'GAME_PHASE_VOTING'
            })
        })

        props.socket.on(START_GAME, ({gamePhase}) => {
            this.setState({
                gamePhase
            })
        })

        props.socket.on(VOTING_PHASE_REVEAL, ({newChancellor}) => {
            if(newChancellor) {
                this.setState({
                    chancellorName: newChancellor
                })
            }
        })

        props.socket.on(CHANCELLOR_CHOICE_PHASE, ({presidentName, playersChoices}) => {
            const {userName} = this.props
            this.setState({presidentName})
            if(presidentName === userName) {
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
        const {playersList, isVotingModalShown, gamePhase, presidentName, chancellorName, isChancellorChoiceShown, potentialChancellorsChoices, chancellorCandidateName} = this.state
        console.info('Current game phase: ', gamePhase)
        return (
            <GameRoomComponent
                socket={socket}
                userName={userName}
                playersList={playersList}
                gamePhase={gamePhase}
                isVotingModalShown={isVotingModalShown}
                onVotingModalHide={this.hideVotingModal}
                presidentName={presidentName}
                chancellorName={chancellorName}
                onChancellorChoiceHide = {this.onChancellorChoiceHide}
                isChancellorChoiceShown = {isChancellorChoiceShown}
                potentialChancellorsChoices = {potentialChancellorsChoices}
                chancellorCandidate = {chancellorCandidateName}
            />
        )
    }
}
