import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Scrollbars } from 'react-custom-scrollbars'
import classNames from 'classnames/bind'

const ModalComponent = ({
    isVisible,
    title,
    overlayClosesModal,
    isCloseButtonShown,
    isOverlayOpaque,
    closeModal,
    child,
}) => {
    if (!isVisible) return (
        <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={0} transitionLeaveTimeout={0} />
    );

    const overlayClasses = classNames('overlay modal-overlay', { opaque: isOverlayOpaque })
    return (
        <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
            <div className="modal-container">
                <div className={classNames('modal-content')}>
                    {isCloseButtonShown && <a className="modal-close-button" onClick={closeModal}>?</a>}
                    <div className="modal-title">{title}</div>
                    <div className="modal-body">{child}</div>
                </div>
                <a className={overlayClasses} onClick={overlayClosesModal ? closeModal : null} />
            </div>
        </ReactCSSTransitionGroup>
    )
}

export default ModalComponent
