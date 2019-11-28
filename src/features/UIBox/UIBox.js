import React from 'react'
import { GameControls } from './GameControls'
import { Submenu } from './Submenu'

import styles from './UIBox.module.css'

const UIBox = () => (
    <div className={styles.uiBox}>
        <GameControls />
        <Submenu />
    </div>
)

UIBox.displayName = 'UIBox'
export default UIBox
