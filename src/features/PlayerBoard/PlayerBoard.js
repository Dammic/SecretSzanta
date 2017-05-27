'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {PlayerRole} from '../../../Dictionary'
import PlayerBoardComponent from './PlayerBoardComponent'

export class PlayerBoard extends React.PureComponent {

    constructor () {
        super()
        this.state = {
            policies: 0
        }

        this.TestTimer = setInterval(() => {
            this.setState({
                policies: this.state.policies + 1
            })
        }, 1000)
    }

    makePlayer (player) {
        let role
        if (this.props.president && player.playerName === this.props.president.playerName) {
            role = PlayerRole.ROLE_PRESIDENT
        } else if (this.props.chancellor && player.playerName === this.props.chancellor.playerName) {
            role = PlayerRole.ROLE_CHANCELLOR
        } else {
            role = null
        }

        return {
            playerName: player.playerName,
            role: role,
            avatarNumber: player.avatarNumber
        }
    }

    render () {
        const playersWithoutMe = this.props.playersList.filter(player => (player.playerName !== this.props.userName))
        const players = playersWithoutMe.map(
            player => this.makePlayer(player)
        )

        let left = []
        let center = []
        let right = []

        players.map((player, index) => {
            if (index % 3 == 0) left.push(player)
            else if (index % 3 == 1) right.push(player)
            else center.push(player)
        })

        if (this.state.policies > 4) {
            clearInterval(this.TestTimer)
        }

        return (
            <PlayerBoardComponent
                playersLeft = {left}
                playersMiddle = {center}
                playersRight = {right}
                policiesLiberalCount = {this.state.policies}
                policiesFacistCount = {this.state.policies + 1}
            />
        )
    }
}


const mapStateToProps = ({user, room}) => {
    return {
        userName: user.userName,
        playersList: room.playersList,
        president: room.president,
        chancellor: room.chancellor,
        gamePhase: room.gamePhase
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayerBoard)
