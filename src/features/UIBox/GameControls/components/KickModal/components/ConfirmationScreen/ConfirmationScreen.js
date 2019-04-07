import React from 'react'
import PropTypes from 'prop-types'
import { ControlButton } from '../../../../../../Shared/Buttons'
import { KickModalTypes } from '../../KickModal'

import styles from './ConfirmationScreen.css'

export const ConfirmationScreen = ({ onNextStepClick, onBackClick, type }) => {
    return (
        <div>
            hello2
            <ControlButton onClick={onNextStepClick}>
                {type === KickModalTypes.Kick ? 'Kick player' : 'Ban player'}
            </ControlButton>
            <ControlButton onClick={onBackClick}>Go back</ControlButton>
        </div>
    )
}

ConfirmationScreen.propTypes = {
    onNextStepClick: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
    type: PropTypes.string
}
