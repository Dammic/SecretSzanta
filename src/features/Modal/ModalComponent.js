'use strict'
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Scrollbars } from 'react-custom-scrollbars'

const ModalComponent = ({
    body,
    show,
    onHide,
    customClass
}) => {
    if(show) {
        return (
            <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                <div className="modal-container">
                    <Scrollbars className="modal-content">{body}</Scrollbars>
                    <a className="modal-overlay" onClick={onHide} />
                </div>
            </ReactCSSTransitionGroup>
        )
    } else {
        return <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={0} transitionLeaveTimeout={0}/>
    }
}

export default ModalComponent
