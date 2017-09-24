import React from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import UIBoxComponent from './UIBoxComponent'
import PlayerAvatarComponent from '../PlayerBoard/Player/PlayerAvatar/PlayerAvatarComponent'
import { SocketEvents } from '../../../Dictionary'
import { socket } from '../../utils/SocketHandler'

export class UIBox extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            isAffiliationHidden: false,
        }
    }
    onStartVote = () => {
        socket.emit(SocketEvents.CHANCELLOR_CHOICE_PHASE)
    }

    onStartGame = () => {
        socket.emit(SocketEvents.START_GAME, { playerName: this.props.userName })
    }

    onKillClick = () => {
        socket.emit(SocketEvents.TEST_START_KILL_PHASE)
    }
    
    toggleShow = () => {
        this.setState({ isAffiliationHidden: !this.state.isAffiliationHidden })
    }

    getPlayerCard = () => {
        const { facistAvatar, liberalAvatar } = this.props
        if (!liberalAvatar) return null
        
        return (<PlayerAvatarComponent
            liberalAvatar={liberalAvatar}
            facistAvatar={facistAvatar}
        />)
    }


    render() {
        const { affiliation, role } = this.props
        return (
            <UIBoxComponent
                onStartVote={this.onStartVote}
                onStartGame={this.onStartGame}
                onKillClick={this.onKillClick}
                onShowAffiliationClick={this.toggleShow}
                affiliation={affiliation}
                role={role}
                getPlayerCard={this.getPlayerCard}
                isAffiliationHidden={this.state.isAffiliationHidden}
            />
        )
    }
}

const mapStateToProps = ({ user, room }) => {
    const player = get(room.playersDict, `${user.userName}`)
    return {
        userName: user.userName,
        affiliation: get(player, 'affiliation'),
        facistAvatar: get(player, 'facistAvatar'),
        liberalAvatar: get(player, 'avatarNumber'),
        role: get(player, 'role'),
    }
}

export default connect(mapStateToProps)(UIBox)
