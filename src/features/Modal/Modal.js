'use strict'
import React from 'react'
import ModalComponent from './ModalComponent'

export default class Modal extends React.PureComponent {

    render () {
        const {children, closeModal} = this.props
        return (
            <ModalComponent body={children} closeModal={closeModal} />
        )
    }
}
