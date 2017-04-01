'use strict'
import React from 'react'
import CreateGameModalComponent from './CreateGameModalComponent'


export default class CreateGameModal extends React.PureComponent {

    constructor (props) {
        super(props)
    }

    render () {
        const {showModal, onHide, onCreate} = this.props
        return(
            <CreateGameModalComponent showModal={showModal} onHide={onHide} onCreate={onCreate}/>
        )
    }
}
