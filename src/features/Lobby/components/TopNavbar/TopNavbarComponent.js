import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../../../Shared/Buttons'

import styles from './TopNavbar.module.css'
import commonStyles from '../../../Shared/CommonStyles/commonStyles.module.css'

export const TopNavbarComponent = ({ onShowModal, userName }) => (
    <div className={styles.topBar}>
        <span className={commonStyles.ellipsis}>Hello <b>{userName}</b>!</span>
        <ControlButton onClick={onShowModal}>New room</ControlButton>
    </div>
)


TopNavbarComponent.propTypes = {
    onShowModal: PropTypes.func,
    userName: PropTypes.string,
}
