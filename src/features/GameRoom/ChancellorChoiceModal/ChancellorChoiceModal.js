'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChancellorChoiceModalComponent from './ChancellorChoiceModalComponent'
import {SocketEvents} from '../../../../Dictionary'
import {socket} from '../../../utils/socket'
import {toggleChancellorChoiceModal} from '../../../ducks/roomDuck'

export class ChancellorChoiceModal extends React.PureComponent {
    onChancellorChoice = (event) => {
        socket.emit(SocketEvents.VOTING_PHASE_START, { chancellorName: event.target.getAttribute('data-playername')})
        this.props.roomActions.toggleChancellorChoiceModal(false)
    }

    render () {
        return (
            <ChancellorChoiceModalComponent
                showModal={this.props.isChancellorChoiceModalShown}
                potentialChancellorsChoices={this.props.potentialChancellorsChoices}
                onChancellorChoice={this.onChancellorChoice} />
        )
    }
}

const mapStateToProps = ({room}) => {
    return {
        potentialChancellorsChoices: room.potentialChancellorsChoices,
        isChancellorChoiceModalShown: room.isChancellorChoiceModalShown
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        roomActions: bindActionCreators({toggleChancellorChoiceModal}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChancellorChoiceModal)
