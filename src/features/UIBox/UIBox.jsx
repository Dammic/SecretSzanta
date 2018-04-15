import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, map, reject } from 'lodash'
import UIBoxComponent from './UIBoxComponent'
import PlayerAvatarComponent from '../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'
import { toggleAffiliationMenu } from '../../ducks/userDuck'
import { startGame, startKickPlayerMode, startBanPlayerMode, startVoting } from '../../gameLogic/ownerActions'

import styles from './UIBox.css'

export class UIBox extends React.PureComponent {
    onKickPlayer = () => startKickPlayerMode(this.props.userName, this.props.playersWithoutMe)

    onBanPlayer = () => startBanPlayerMode(this.props.userName, this.props.playersWithoutMe)

    onStartGame = () => startGame(this.props.userName)

    toggleShow = () => {
        this.props.userActions.toggleAffiliationMenu()
    }

    getPlayerCard = () => {
        const { facistAvatar, liberalAvatar, isOwner, isDead } = this.props
        if (!liberalAvatar) return null

        return (
            <PlayerAvatarComponent
                liberalAvatar={liberalAvatar}
                facistAvatar={facistAvatar}
                isOwner={isOwner}
                isDead={isDead}
                className={styles.uiBoxAvatar}
            />
        )
    }

    render() {
        const { affiliation, gamePhase, role, isAffiliationHidden, isOwner } = this.props
        return (
            <UIBoxComponent
                onStartVote={startVoting}
                onStartGame={this.onStartGame}
                onKickPlayer={this.onKickPlayer}
                onBanPlayer={this.onBanPlayer}
                onShowAffiliationClick={this.toggleShow}
                isOwner={isOwner}
                gamePhase={gamePhase}
                affiliation={affiliation}
                role={role}
                getPlayerCard={this.getPlayerCard}
                isAffiliationHidden={isAffiliationHidden}
            />
        )
    }
}

const mapStateToProps = ({ user, room }) => {
    const player = get(room.playersDict, `${user.userName}`)
    const playersWithoutMe = map(reject(room.playersDict, { playerName: user.userName }), 'playerName')
    return {
        userName: user.userName,
        isAffiliationHidden: user.isAffiliationHidden,
        playersWithoutMe,
        isOwner: room.ownerName === user.userName,
        affiliation: get(player, 'affiliation'),
        facistAvatar: get(player, 'facistAvatar'),
        liberalAvatar: get(player, 'avatarNumber'),
        isDead: get(player, 'isDead'),
        role: get(player, 'role'),
        gamePhase: room.gamePhase,
    }
}

const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators({ toggleAffiliationMenu }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(UIBox)
