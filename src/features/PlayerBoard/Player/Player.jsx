import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { isUndefined, get, includes } from 'lodash'
import PlayerComponent from './PlayerComponent'
import { PlayerDirection, PlayerRole, GamePhases } from '../../../../Dictionary'

export class Player extends React.PureComponent {
    static propTypes = {
        // parent
        player: PropTypes.objectOf(PropTypes.any),
        direction: PropTypes.string,
        onChoiceModeSelect: PropTypes.func,

        // redux
        votes: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.string])),
        choiceMode: PropTypes.shape({
            isVisible: PropTypes.bool,
            selectablePlayers: PropTypes.arrayOf(PropTypes.string),
        }),
    }

    getRolePicture = () => {
        const { role } = this.props.player
        switch (role) {
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
        const { votes } = this.props
        const { playerName } = this.props.player
        const hasPlayerVoted = !isUndefined(get(votes, playerName))

        switch (this.props.direction) {
            case PlayerDirection.PLAYER_DIRECTION_LEFT:
                return classNames('bubble-left', { active: hasPlayerVoted })
            case PlayerDirection.PLAYER_DIRECTION_RIGHT:
                return classNames('bubble-right', { active: hasPlayerVoted })
            default:
                return classNames('bubble-top', { active: hasPlayerVoted })
        }
    }

    getVoteValue = () => {
        const { votes } = this.props
        const { playerName } = this.props.player
        const vote = get(votes, playerName)

        let voteValue
        if (vote === '' || isUndefined(vote)) {
            voteValue = vote
        } else {
            voteValue = (vote ? 'JA' : 'NEIN')
        }
        return voteValue
    }

    isSelectable = () => {
        const { choiceMode, player: { playerName } } = this.props
        return choiceMode.isVisible && includes(choiceMode.selectablePlayers, playerName)
    }

    onPlayerClick = (event) => {
        this.props.onChoiceModeSelect(event.target.getAttribute('data-playername'))
    }

    render() {
        const { gamePhase, votes, choiceMode: { isVisible, chooserPlayerName }, player: { playerName, avatarNumber } } = this.props
        const isSelectable = this.isSelectable()
        const avatarPicture = require(`../../../static/Avatar${avatarNumber}.png`)
        const isPlayerWaitedFor = (
            (gamePhase === GamePhases.GAME_PHASE_VOTING && isUndefined(get(votes, playerName))) ||
            chooserPlayerName === playerName
        )

        const voteValue = this.getVoteValue()
        return (
            <PlayerComponent
                playerName={playerName}
                avatar={avatarPicture}
                rolePicture={this.getRolePicture()}
                voteBubbleStyle={this.getVoteBubbleStyle()}
                voteValue={voteValue}
                isChoiceModeVisible={isVisible}
                isSelectable={isSelectable}
                onChoiceModeSelect={this.onPlayerClick}
                isPlayerWaitedFor={isPlayerWaitedFor}
            />
        )
    }
}

const mapStateToProps = ({ room, players }) => ({
    votes: room.votes,
    gamePhase: room.gamePhase,
    choiceMode: players.choiceMode,
})

export default connect(mapStateToProps)(Player)
