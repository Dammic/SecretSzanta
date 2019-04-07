import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GameControlsComponent from './GameControlsComponent'
import { toggleAffiliationMenu } from '../../../ducks/userDuck'
import { startGame } from '../../../gameLogic/ownerActions'
import { KickModal, KickModalTypes } from './components/KickModal'

export const GameControls = ({ gamePhase, isAffiliationHidden, isOwner, toggleAffiliationMenu }) => {
    const [activeSpecialModal, setActiveSpecialModal] = useState(null)
    const closeModal = useCallback(() => {
        setActiveSpecialModal(null)
    }, [])

    const showKickModal = useCallback(() => {
        setActiveSpecialModal(KickModalTypes.Kick)
    }, [])

    const showBanModal = useCallback(() => {
        setActiveSpecialModal(KickModalTypes.Ban)
    }, [])

    return (
        <React.Fragment>
            <GameControlsComponent
                onStartGame={startGame}
                onKickPlayer={!activeSpecialModal ? showKickModal : undefined}
                onBanPlayer={!activeSpecialModal ? showBanModal : undefined}
                onShowAffiliationClick={toggleAffiliationMenu}
                isOwner={isOwner}
                gamePhase={gamePhase}
                isAffiliationHidden={isAffiliationHidden}
            />
            <KickModal
                onClose={closeModal}
                isVisible={!!activeSpecialModal}
                type={activeSpecialModal}
            />
        </React.Fragment>
    )
}

GameControls.propTypes = {
    toggleAffiliationMenu: PropTypes.func.isRequired,
    gamePhase: PropTypes.string,
    isOwner: PropTypes.bool,
    isAffiliationHidden: PropTypes.bool,
}

const mapStateToProps = ({ user, room }) => ({
    userName: user.userName,
    isAffiliationHidden: user.isAffiliationHidden,
    isOwner: room.ownerName === user.userName,
    gamePhase: room.gamePhase,
})

const mapDispatchToProps = dispatch => ({
    toggleAffiliationMenu: () => dispatch(toggleAffiliationMenu()),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameControls)
