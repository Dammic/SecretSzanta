import React from 'react'
import GameControls from './GameControls/GameControls'
import Submenu from './Submenu/Submenu'

import styles from './UIBox.css'

const UIBox = () => (
    <div className={styles.uiBox}>
        <GameControls />
        <Submenu />
    </div>
)

UIBox.displayName = 'UIBox'
export default UIBox
