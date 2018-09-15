import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isUndefined, get, includes } from 'lodash'
import PlayerComponent from './PlayerComponent'
import { GamePhases } from '../../../../Dictionary'

export class Player extends React.PureComponent {
    static displayName = 'Player'
    static propTypes = {
        // parent
        player: PropTypes.objectOf(PropTypes.any),
        direction: PropTypes.string,
        onChoiceModeSelect: PropTypes.func,

        // redux
        votes: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.string])),
        roomOwnerName: PropTypes.string,
        gamePhase: PropTypes.string,
        choiceMode: PropTypes.shape({
            isVisible: PropTypes.bool,
            selectablePlayers: PropTypes.arrayOf(PropTypes.string),
        }),
    }

    onPlayerClick = (event) => {
        if (this.isSelectable()) {
            this.props.onChoiceModeSelect(event.target.getAttribute('data-playername'))
        }
    }

    isSelectable = () => {
        const { choiceMode, player: { playerName, isDead } } = this.props
        return choiceMode.isVisible && includes(choiceMode.selectablePlayers, playerName) && !isDead
    }

    isWaitIconVisible = () => {
        const {
            gamePhase,
            votes,
            choiceMode: { chooserPlayerName },
            player: { playerName, isDead },
        } = this.props
        return (gamePhase === GamePhases.GAME_PHASE_VOTING && isUndefined(get(votes, playerName)) && !isDead) ||
            chooserPlayerName === playerName
    }

    render() {
        const {
            roomOwnerName,
            direction,
            choiceMode: { isVisible },
            player: { playerName, facistAvatar, avatarNumber, isDead, role },
        } = this.props

        return (
            <PlayerComponent
                playerName={playerName}
                liberalAvatar={avatarNumber}
                facistAvatar={facistAvatar}
                role={role}
                isChoiceModeVisible={isVisible}
                isSelectable={this.isSelectable()}
                isDead={isDead}
                onClick={this.onPlayerClick}
                isWaitIconVisible={this.isWaitIconVisible()}
                isOwner={playerName === roomOwnerName}
                bubbleDirection={direction}
            />
        )
    }
}

const mapStateToProps = ({ room, players }) => ({
    votes: room.votes,
    gamePhase: room.gamePhase,
    roomOwnerName: room.ownerName,
    choiceMode: players.choiceMode,
})

export default connect(mapStateToProps)(Player)
