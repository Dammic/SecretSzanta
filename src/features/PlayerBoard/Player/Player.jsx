import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined, get, includes } from 'lodash'
import PlayerComponent from './PlayerComponent'
import { PlayerDirection, GamePhases } from '../../../../Dictionary'

import styles from './Player.css'

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

    getVoteBubbleStyle = () => {
        const { votes, gamePhase } = this.props
        const { playerName } = this.props.player
        const isBubbleActive = !isUndefined(get(votes, playerName)) && gamePhase === GamePhases.GAME_PHASE_VOTING

        switch (this.props.direction) {
            case PlayerDirection.PLAYER_DIRECTION_LEFT:
                return classNames(styles.bubble, styles.bubbleLeft, { [styles.active]: isBubbleActive })
            case PlayerDirection.PLAYER_DIRECTION_RIGHT:
                return classNames(styles.bubble, styles.bubbleRight, { [styles.active]: isBubbleActive })
            default:
                return classNames(styles.bubble, styles.bubbleTop, { [styles.active]: isBubbleActive })
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
        const { gamePhase, votes, roomOwnerName, choiceMode: { isVisible, chooserPlayerName },
            player: { playerName, facistAvatar, avatarNumber, isDead, role } } = this.props
        const isSelectable = this.isSelectable()
        const isPlayerWaitedFor = (
            (gamePhase === GamePhases.GAME_PHASE_VOTING && isUndefined(get(votes, playerName)) && !isDead) ||
            chooserPlayerName === playerName
        )

        const voteValue = this.getVoteValue()
        return (
            <PlayerComponent
                playerName={playerName}
                liberalAvatar={avatarNumber}
                facistAvatar={facistAvatar}
                role={role}
                voteBubbleStyle={this.getVoteBubbleStyle()}
                voteValue={voteValue}
                isChoiceModeVisible={isVisible}
                isSelectable={isSelectable && !isDead}
                isDead={isDead}
                onChoiceModeSelect={this.onPlayerClick}
                isPlayerWaitedFor={isPlayerWaitedFor}
                isOwner={playerName === roomOwnerName}
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
