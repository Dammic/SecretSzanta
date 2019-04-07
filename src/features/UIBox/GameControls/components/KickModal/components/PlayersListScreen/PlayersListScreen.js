import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../../../../../../Shared/Buttons'

import styles from './PlayersListScreen.css'

export const PlayersListScreen = ({ onNextStepClick }) => {
    return (
        <div>
            hello1
            <ControlButton onClick={onNextStepClick}>Kick player</ControlButton>
        
        </div>
    )
}

PlayersListScreen.propTypes = {
    onNextStepClick: PropTypes.func.isRequired,
}
