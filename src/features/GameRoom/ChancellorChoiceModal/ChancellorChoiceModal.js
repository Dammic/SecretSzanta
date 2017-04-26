'use strict'
import React from 'react'
import ChancellorChoiceModalComponent from './ChancellorChoiceModalComponent'
import {VOTING_PHASE_START} from '../../../const/SocketEvents'

export default class ChancellorChoiceModal extends React.PureComponent {

    onChancellorChoice = (event) => {
        const {onHide, socket} = this.props
        console.info(event.target.getAttribute('data-playername'))
        socket.emit(VOTING_PHASE_START, { chancellorName: event.target.getAttribute('data-playername')})
        onHide()
    }

    render () {
        const {showModal, chancellorsChoices} = this.props
        return (
            <ChancellorChoiceModalComponent
                showModal={showModal}
                chancellorsChoices={chancellorsChoices}
                onChancellorChoice={this.onChancellorChoice} />
        )
    }
}
