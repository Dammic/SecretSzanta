import React from 'react'

import { Button } from '../../Shared/Buttons'

import styles from './TopNavbar.css'

export const TopNavbarComponent = ({
    onShowModal,
}) => (
    <div className={styles.topBar}>
        <Button onClick={onShowModal}>New room</Button>
    </div>
)
