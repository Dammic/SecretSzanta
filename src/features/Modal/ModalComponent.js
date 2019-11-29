import React from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames/bind'
import { Icon } from '../Shared/Icon'

import styles from './Modal.module.css'

const ModalComponent = ({
    isVisible = false,
    title,
    overlayClosesModal,
    isCloseButtonShown,
    isOverlayOpaque,
    closeModal,
    child,
}) => {
    const overlayClasses = classNames(styles.modalOverlay, { [styles.opaque]: isOverlayOpaque })

    return (
        <CSSTransition
            in={isVisible}
            timeout={700}
            unmountOnExit
            mountOnEnter
            appear
            classNames={{
                enter: styles.modalEnter,
                enterActive: styles.modalEnterActive,
                exit: styles.modalExit,
                exitActive: styles.modalExitActive,
            }}
        >
            <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                    {isCloseButtonShown && (
                        <a className={styles.modalCloseButton} onClick={closeModal}>
                            <Icon name="fa-times" />
                        </a>
                    )}
                    <div className={styles.modalTitle}>{title}</div>
                    <div className={styles.modalBody}>{child}</div>
                </div>
                <a className={overlayClasses} onClick={overlayClosesModal ? closeModal : null} />
            </div>
        </CSSTransition>
    )
}

export default ModalComponent
