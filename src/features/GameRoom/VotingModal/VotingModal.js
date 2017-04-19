'use strict'
import React from 'react'
import VotingModalComponent from './VotingModalComponent'

export default class VotingModal extends React.PureComponent {

    render () {
        const {showModal, onHide, socket} = this.props
        return(
            <VotingModalComponent showModal={showModal} onHide={onHide} socket={socket}/>
        )
    }
}
