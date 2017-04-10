'use strict'
import React from 'react'
import ModalComponent from './ModalComponent'

class Modal extends React.PureComponent {
    render () {
        const {children, show, onHide, customClass, clickOutside=true, isCloseButton=true} = this.props
        return <ModalComponent
            body={children}
            show={show}
            onHide={onHide}
            customClass={customClass}
            clickOutside={clickOutside}
            isCloseButton={isCloseButton}
        />
    }
}

const {object, bool, func, string} = React.PropTypes
Modal.propTypes = {
    children: object.isRequired,
    show: bool.isRequired,
    onHide: func.isRequired,
    clickOutside: bool,
    isCloseButton: bool,
    customClass: string
}

export default Modal