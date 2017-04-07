'use strict'
import React from 'react'
import CreateGameModalComponent from './CreateGameModalComponent'

export default class CreateGameModal extends React.PureComponent {

    render () {
        const {showModal, onHide, onCreate, socket} = this.props
        return(
            <CreateGameModalComponent showModal={showModal} onHide={onHide} onCreate={onCreate} socket={socket}/>

        )
    }
}
