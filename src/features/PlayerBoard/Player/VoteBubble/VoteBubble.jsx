import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isUndefined, get } from 'lodash'
import { PlayerDirection, GamePhases } from '../../../../../Dictionary'

import styles from './VoteBubble.css'

export class VoteBubble extends React.PureComponent {
    static displayName = 'VoteBubble'
    static propTypes = {
        // parent
        playerName: PropTypes.string.isRequired,
        direction: PropTypes.string,

        // redux
        votes: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.string])),
        gamePhase: PropTypes.string,
    }

    getVoteBubbleStyle = () => {
        const { direction } = this.props

        switch (direction) {
            case PlayerDirection.PLAYER_DIRECTION_LEFT:
                return classNames(styles.bubble, styles.bubbleLeft, { [styles.active]: this.isBubbleActive() })
            case PlayerDirection.PLAYER_DIRECTION_RIGHT:
                return classNames(styles.bubble, styles.bubbleRight, { [styles.active]: this.isBubbleActive() })
            default:
                return classNames(styles.bubble, styles.bubbleTop, { [styles.active]: this.isBubbleActive() })
        }
    }

    getVoteValue = () => {
        const { votes, playerName } = this.props
        const vote = get(votes, playerName)

        // it means the user has not voted yet, ex. he's not in the votes object
        if (isUndefined(vote)) {
            return undefined
        // it means the user has voted, but the votes have not been revealed yet
        } else if (vote === '') {
            return ''
        }
        return (vote ? 'JA' : 'NEIN')
    }

    isBubbleActive = () => {
        const { votes, gamePhase, playerName } = this.props
        return !isUndefined(get(votes, playerName)) && gamePhase === GamePhases.GAME_PHASE_VOTING
    }

    render() {
        const voteValue = this.getVoteValue()
        if (isUndefined(voteValue)) {
            return null
        }

        return (
            <div className={this.getVoteBubbleStyle()}>{voteValue}</div>
        )
    }
}

const mapStateToProps = ({ room }) => ({
    votes: room.votes,
    gamePhase: room.gamePhase,
})

export default connect(mapStateToProps)(VoteBubble)
