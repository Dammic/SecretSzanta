import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../../Shared/Buttons'

import styles from './TopNavbar.css'
import commonStyles from '../../../Shared/CommonStyles/commonStyles.css'

export const TopNavbarComponent = ({ onShowModal, userName }) => (
    <div className={styles.topBar}>
        <span className={commonStyles.ellipsis}>Hello <b>{userName}</b>!</span>
        <div>
            <Button onClick={onShowModal}>New room</Button>
        </div>
    </div>
)


TopNavbarComponent.propTypes = {
    onShowModal: PropTypes.func,
    userName: PropTypes.string,
}
