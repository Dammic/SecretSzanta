import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../../../../../../Shared/Buttons'

import styles from './ConfirmationScreen.css'

export const ConfirmationScreen = ({ onNextStepClick, onBackClick }) => {
    return (
        <div>
            hello2
            <ControlButton onClick={onNextStepClick}>Kick player</ControlButton>
            <ControlButton onClick={onBackClick}>Go back</ControlButton>
        </div>
    )
}

ConfirmationScreen.propTypes = {
    onNextStepClick: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
}
