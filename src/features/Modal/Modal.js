'use strict'
import React from 'react'
import ModalComponent from './ModalComponent'

export default class Modal extends React.PureComponent {

    render () {
        const {children, show, onHide, customClass} = this.props
        return <ModalComponent body={children} show={show} onHide={onHide} customClass={customClass} />
    }
}
