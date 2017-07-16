import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { map, reject, find, forEach } from 'lodash'
import { PlayerRole } from '../../../Dictionary'
import PlayerBoardComponent from './PlayerBoardComponent'
import { increasePolicyCount } from '../../ducks/roomDuck'

export class PlayerBoard extends React.PureComponent {
    static propTypes = {
        // redux
        roomActions: PropTypes.objectOf(PropTypes.func),
        playersDict: PropTypes.objectOf(PropTypes.any),
        userName: PropTypes.string,
        facistPoliciesCount: PropTypes.number,
        liberalPoliciesCount: PropTypes.number,
    }

    constructor(props) {
        super(props)
        props.roomActions.increasePolicyCount(true)
        props.roomActions.increasePolicyCount(false)
    }

    makePlayer = (player) => {
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
            role,
            avatarNumber: player.avatarNumber,
        }
    }

    render() {
        const playersWithoutMe = reject(this.props.playersDict, { playerName: this.props.userName })
        const players = map(playersWithoutMe, player => this.makePlayer(player))
        const left = []
        const center = []
        const right = []

        forEach(players, (player, index) => {
            if (index % 3 === 0) {
                left.push(player)
            } else if (index % 3 === 1) {
                right.push(player)
            } else {
                center.push(player)
            }
        })

        return (<PlayerBoardComponent
            playersLeft={left}
            playersMiddle={center}
            playersRight={right}
            policiesLiberalCount={this.props.liberalPoliciesCount}
            policiesFacistCount={this.props.facistPoliciesCount}
        />)
    }
}

const mapStateToProps = ({ user, room }) => ({
    userName: user.userName,
    playersDict: room.playersDict,
    facistPoliciesCount: room.facistPoliciesCount,
    liberalPoliciesCount: room.liberalPoliciesCount,
})

const mapDispatchToProps = dispatch => ({
    roomActions: bindActionCreators({ increasePolicyCount }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerBoard)
