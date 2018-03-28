import React from 'react'

import styles from './TopNavbar.css'

import { Button } from '../../Shared/Buttons'

export const TopNavbarComponent = ({
    onShowModal,
}) => (
    <div className={topBar}>
        <Button onClick={onShowModal}>New room</Button>
    </div>
)
