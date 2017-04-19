'use strict'
import React from 'react'
import ChancellorChoiceModalComponent from './ChancellorChoiceModalComponent'
import {CLIENT_VOTE} from '../../../../const/SocketEvents'

export default class ChancellorChoiceModal extends React.PureComponent {
    render () {
        const {showModal, chancellorsChoices, onChancellorChoiceHide, socket} = this.props
        console.info(chancellorsChoices)
        return (
            <ChancellorChoiceModalComponent showModal={showModal} chancellorsChoices={chancellorsChoices} onHide={onChancellorChoiceHide} socket={socket}/>
        )
    }
}
