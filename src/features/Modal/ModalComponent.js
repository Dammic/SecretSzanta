'use strict'
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Scrollbars } from 'react-custom-scrollbars'
import classNames from 'classnames/bind'

const ModalComponent = ({
    body,
    show,
    onHide,
    customClass,
    clickOutside,
    isCloseButton
}) => {
    if(show) {
        return (
            <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                <div className="modal-container">
                    <Scrollbars className={classNames("modal-content", {[customClass]: !!customClass})}>
                        {isCloseButton && <a className="modal-close-button" onClick={onHide}>✖</a>}
                        <div className="modal-body">{body}</div>
                    </Scrollbars>
                    <a className="modal-overlay" onClick={clickOutside ? onHide : null} />
                </div>
            </ReactCSSTransitionGroup>
        )
    } else {
        return <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={0} transitionLeaveTimeout={0}/>
    }
}

export default ModalComponent
