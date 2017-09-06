import React from 'react'
import { connect } from 'react-redux'
import UIBoxComponent from './UIBoxComponent'
import { SocketEvents } from '../../../Dictionary'
import { socket } from '../../utils/SocketHandler'

export class UIBox extends React.PureComponent {
    constructor() {
        super();
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
        this.setState({ isAffiliationHidden: !this.state.isAffiliationHidden}) 
    }

    render() {
        return (
            <UIBoxComponent
                onStartVote={this.onStartVote}
                onStartGame={this.onStartGame}
                onKillClick={this.onKillClick}
                onShowAffiliationClick={this.toggleShow}
                isAffiliationHidden={this.state.isAffiliationHidden}
            />
        )
    }
}

const mapStateToProps = ({ user }) => ({
    userName: user.userName,
})

export default connect(mapStateToProps)(UIBox)
