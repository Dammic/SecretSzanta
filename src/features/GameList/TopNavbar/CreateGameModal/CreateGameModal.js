'use strict'
import React from 'react'
import CreateGameModalComponent from './CreateGameModalComponent'
import {socket} from '../../../../utils/socket'

export default class CreateGameModal extends React.PureComponent {

    render () {
        const {showModal, onHide, onCreate} = this.props
        return (
            <CreateGameModalComponent showModal={showModal} onHide={onHide} onCreate={onCreate}/>
        )
    }
}
