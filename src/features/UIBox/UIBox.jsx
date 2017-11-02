import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, map, reject } from 'lodash'
import UIBoxComponent from './UIBoxComponent'
import PlayerAvatarComponent from '../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'
import { SocketEvents, ChoiceModeContexts } from '../../../Dictionary'
import { toggleAffiliationMenu } from '../../ducks/userDuck'
import { resetTracker } from '../../ducks/roomDuck'
import * as playerActions from '../../ducks/playersDuck'
import { socket } from '../../utils/SocketHandler'

export class UIBox extends React.PureComponent {
    onStartVote = () => {
        socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE)
    }

    onKickPlayer = () => {
        this.props.playersActions.setChooserPlayer({ playerName: this.props.userName })
        console.log(this.props.playersWithoutMe)
        this.props.playersActions.setChoiceMode({
            isVisible: true,
            context: ChoiceModeContexts.KickChoice,
            selectablePlayers: this.props.playersWithoutMe,  
        })
    }

    onBanPlayer = () => {
        this.props.playersActions.setChooserPlayer({ playerName: this.props.userName })
        this.props.playersActions.setChoiceMode({
            isVisible: true,
            context: ChoiceModeContexts.BanChoice,
            selectablePlayers: this.props.playersWithoutMe,
        })
    }

    onStartGame = () => {
        socket.emit(SocketEvents.START_GAME, { playerName: this.props.userName })
        this.props.roomActions.resetTracker()
    }

    toggleShow = () => {
        this.props.userActions.toggleAffiliationMenu()
    }

    getPlayerCard = () => {
        const { facistAvatar, liberalAvatar, isOwner } = this.props
        if (!liberalAvatar) return null
        
        return (<PlayerAvatarComponent
            liberalAvatar={liberalAvatar}
            facistAvatar={facistAvatar}
            isOwner={isOwner}
        />)
    }


    render() {
        const { affiliation, role, isAffiliationHidden, isOwner} = this.props
        return (
            <UIBoxComponent
                onStartVote={this.onStartVote}
                onStartGame={this.onStartGame}
                onKickPlayer={this.onKickPlayer}
                onBanPlayer={this.onBanPlayer}
                onShowAffiliationClick={this.toggleShow}
                isOwner={isOwner}
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
        role: get(player, 'role'),
    }
}

const mapDispatchToProps = dispatch => ({
    roomActions: bindActionCreators({ resetTracker }, dispatch),
    userActions: bindActionCreators({ toggleAffiliationMenu }, dispatch),
    playersActions: bindActionCreators(playerActions, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(UIBox)
