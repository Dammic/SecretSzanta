'use strict'
import React from 'react'
import classNames from 'classnames/bind'
import _find from 'lodash/find'
import PlayerComponent from './PlayerComponent'
import {PlayerDirection, PlayerRole, SocketEvents} from '../../../../Dictionary'

export default class Player extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            voteBubbleInfo: null
        }

        props.socket.on(SocketEvents.CHANCELLOR_CHOICE_PHASE, () => {
            this.setState({ voteBubbleInfo: null})
        })

        props.socket.on(SocketEvents.VOTING_PHASE_NEWVOTE, ({playerName}) => {
            const {player} = this.props
            if(playerName === player.playerName) {
                this.setState({ voteBubbleInfo: {voteValue: ''} })
            }
        })

        props.socket.on(SocketEvents.VOTING_PHASE_REVEAL, ({votes}) => {
            const {player} = this.props
            const thisPlayerVote = _find(votes, (vote) => vote.playerName === player.playerName)
            if(thisPlayerVote) {
                this.setState({ voteBubbleInfo: {voteValue: thisPlayerVote.value ? 'JA' : 'NEIN'} })
            }
        })
    }

    getRolePicture = () => {
        const {role} = this.props.player
        switch(role) {
            case PlayerRole.ROLE_CHANCELLOR:
                return require('../../../static/Chancellor.png')
            case PlayerRole.ROLE_PRESIDENT:
                return require('../../../static/President.png')
            case PlayerRole.ROLE_PREVIOUS_CHANCELLOR:
                return require('../../../static/PreviousChancelor.png')
            case PlayerRole.ROLE_PREVIOUS_PRESIDENT:
                return require('../../../static/PreviousPresident.png')
            default:
                return null
        }
    }

    getVoteBubbleStyle = () => {
        const {voteBubbleInfo} = this.state
        switch(this.props.direction) {
            case PlayerDirection.PLAYER_DIRECTION_LEFT:
                return classNames('bubble-left', {'active' : !!voteBubbleInfo})
            case PlayerDirection.PLAYER_DIRECTION_RIGHT:
                return classNames('bubble-right', {'active' : !!voteBubbleInfo})
            default:
                return classNames('bubble-top', {'active' : !!voteBubbleInfo})
        }
    }

    render() {
        const {socket} = this.props
        const {voteBubbleInfo} = this.state
        const {playerName, avatarNumber} = this.props.player
        const avatarPicture = require(`../../../static/Avatar${avatarNumber}.png`)

        return (
            <PlayerComponent 
                playerName = {playerName}
                avatar = {avatarPicture}
                rolePicture = {this.getRolePicture()}
                voteBubbleStyle = {this.getVoteBubbleStyle()}
                voteBubbleInfo = {voteBubbleInfo}
                socket={socket} />
        )
    }

}

