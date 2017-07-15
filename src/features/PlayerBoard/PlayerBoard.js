'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PlayerRole } from '../../../Dictionary'
import PlayerBoardComponent from './PlayerBoardComponent'
import { increasePolicyCount } from '../../ducks/roomDuck'
import { filter, find } from 'lodash';

export class PlayerBoard extends React.PureComponent {
    constructor (props) {
        super(props)
        props.roomActions.increasePolicyCount(true);
        props.roomActions.increasePolicyCount(false);
    }

    makePlayer (player) {
        const currentPresident = find(this.props.playersDict, { role: PlayerRole.ROLE_PRESIDENT })
        const currentChancellor = find(this.props.playersDict, { role: PlayerRole.ROLE_CHANCELLOR })
        let role
        if (currentPresident && player.playerName === currentPresident.playerName) {
            role = PlayerRole.ROLE_PRESIDENT
        } else if (currentChancellor && player.playerName === currentChancellor.playerName) {
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
        const playersWithoutMe = filter(this.props.playersDict, (player => (player.playerName !== this.props.userName)))

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


        return (
            <PlayerBoardComponent
                playersLeft = {left}
                playersMiddle = {center}
                playersRight = {right}
                policiesLiberalCount = {this.props.liberalPoliciesCount}
                policiesFacistCount = {this.props.facistPoliciesCount}
            />
        )
    }
}


const mapStateToProps = ({user, room}) => {
    return {
        userName: user.userName,
        playersDict: room.playersDict,
        gamePhase: room.gamePhase,
        facistPoliciesCount: room.facistPoliciesCount,
        liberalPoliciesCount: room.liberalPoliciesCount
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({increasePolicyCount}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayerBoard)
