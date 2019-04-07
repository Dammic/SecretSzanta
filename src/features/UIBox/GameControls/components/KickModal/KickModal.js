import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ModalComponent from '../../../../Modal/ModalComponent'
import { PlayersListScreen } from './components/PlayersListScreen'
import { ConfirmationScreen } from './components/ConfirmationScreen'

const Steps = {
    KickFirstStep: 'KICK_FIRST_STEP',
    KickSecondStep: 'KICK_SECOND_STEP',
}

export const KickModalTypes = {
    Kick: 'KICK_MODAL',
    Ban: 'BAN_MODAL',
}

export const KickModal = ({ onClose, isVisible, type }) => {
    const [currentStep, setCurrentStep] = useState(Steps.KickFirstStep)
    const [selectedPlayer, setSelectedPlayer] = useState(null)

    const goToSecondStep = useCallback(() => {
        setCurrentStep(Steps.KickSecondStep)
    }, [])

    const goToFirstStep = useCallback(() => {
        setCurrentStep(Steps.KickFirstStep)
    }, [])

    const kickPlayer = useCallback(() => {
        console.log("kicking player", selectedPlayer)
    }, [])

    const modalTitle = type === KickModalTypes.Kick ? 'Kicking players' : 'Banning players'

    return (
        <ModalComponent
            isVisible={isVisible}
            title={type ? modalTitle : ''}
            overlayClosesModal={false}
            isCloseButtonShown
            isOverlayOpaque
            closeModal={onClose}
            child={(
                <div>
                    {currentStep === Steps.KickFirstStep && (
                        <PlayersListScreen
                            onNextStepClick={goToSecondStep}
                        />
                    )}
                    {currentStep === Steps.KickSecondStep && (
                        <ConfirmationScreen
                            onNextStepClick={kickPlayer}
                            onBackClick={goToFirstStep}
                        />
                    )}
                </div>
            )}
        />
    )
}
