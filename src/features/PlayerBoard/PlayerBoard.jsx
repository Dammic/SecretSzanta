import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { delay, map, reject, find, forEach } from 'lodash'
import { PlayerRole, ChoiceModeContexts, SocketEvents } from '../../../Dictionary'
import { socket } from '../../utils/SocketHandler'
import PlayerBoardComponent from './PlayerBoardComponent'
import { increasePolicyCount, toggleChoiceMode, increaseTracker, resetTracker } from '../../ducks/roomDuck'
import { hideChoiceMode } from '../../ducks/playersDuck'

export class PlayerBoard extends React.PureComponent {
    static propTypes = {
        // redux
        roomActions: PropTypes.objectOf(PropTypes.func),
        playersDict: PropTypes.objectOf(PropTypes.any),
        userName: PropTypes.string,
        facistPoliciesCount: PropTypes.number,
        liberalPoliciesCount: PropTypes.number,
        trackerPosition: PropTypes.number,
        choiceMode: PropTypes.shape({
            isVisible: PropTypes.bool,
            selectablePlayers: PropTypes.arrayOf(PropTypes.string),
            context: PropTypes.string,
        }),
        playersActions: PropTypes.objectOf(PropTypes.func),
    }

    state = { trackerMoved: false }

    componentWillReceiveProps(nextProps) {
        if (this.props.trackerPosition !== nextProps.trackerPosition) {
            this.setState({ trackerMoved: true })
        } else {
            this.setState({ trackerMoved: false })
        }
    }

    componentDidUpdate() {
        if (this.props.trackerPosition >= 3) delay(this.props.roomActions.resetTracker, 1000)
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
            facistAvatar: player.facistAvatar,
            isDead: player.isDead,
        }
    }

    onChoiceModeSelect = (selection) => {
        const { choiceMode: { context } } = this.props
        switch (context) {
            case ChoiceModeContexts.ChancellorChoice:
                socket.emit(SocketEvents.VOTING_PHASE_START, { chancellorName: selection })
                this.props.playersActions.hideChoiceMode()
                break
            case ChoiceModeContexts.KillChoice:
                socket.emit(SocketEvents.PlayerKilled, { playerName: selection })
                this.props.playersActions.hideChoiceMode()
                break
            default:
                console.info('no action matches the specified context')
        }
    }

    render() {
        const { choiceMode, playersDict, userName, liberalPoliciesCount, facistPoliciesCount, trackerPosition } = this.props
        const playersWithoutMe = reject(playersDict, { playerName: userName })
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
            policiesLiberalCount={liberalPoliciesCount}
            policiesFacistCount={facistPoliciesCount}
            isChoiceModeVisible={choiceMode.isVisible}
            onChoiceModeSelect={this.onChoiceModeSelect}
            trackerPosition={trackerPosition}
            trackerMoved={this.state.trackerMoved}
        />)
    }
}

const mapStateToProps = ({ user, room, players }) => ({
    userName: user.userName,
    playersDict: room.playersDict,
    facistPoliciesCount: room.facistPoliciesCount,
    liberalPoliciesCount: room.liberalPoliciesCount,
    trackerPosition: room.trackerPosition,
    choiceModeContext: room.choiceModeContext,
    choiceMode: players.choiceMode,
})

const mapDispatchToProps = dispatch => ({
    roomActions: bindActionCreators({ increasePolicyCount, increaseTracker, resetTracker, toggleChoiceMode }, dispatch),
    playersActions: bindActionCreators({ hideChoiceMode }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerBoard)
