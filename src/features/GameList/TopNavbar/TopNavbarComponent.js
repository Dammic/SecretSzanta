import React from 'react'

import { ControlButton } from '../../Shared/Buttons'

import styles from './TopNavbar.css'

export const TopNavbarComponent = ({
    onShowModal,
}) => (
    <div className={styles.topBar}>
        <ControlButton onClick={onShowModal}>New room</ControlButton>
    </div>
)
