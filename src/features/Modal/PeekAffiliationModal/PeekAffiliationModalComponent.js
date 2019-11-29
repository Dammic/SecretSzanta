import React from 'react'
import PropTypes from 'prop-types'
import { PlayerAffilications } from '../../../../Dictionary'
import { getAvatar } from '../../../utils/avatarsHelper'
import FacistMembershipImage from '../../../static/Facist_Membership.png'
import LiberalMembershipImage from '../../../static/Liberal_Membership.png'
import { FancyButton } from '../../Shared/Buttons'

import styles from './PeekAffiliationModal.module.css'

const PeekAffiliationModal = ({
    avatarNumber,
    playerName,
    affiliation,
    closeModal,
}) => {
    const membershipImage = (affiliation === PlayerAffilications.FACIST_AFFILIATION ? FacistMembershipImage : LiberalMembershipImage)
    return (
        <div className={styles.peekAffiliationModal}>
            <div className={styles.playerInfo}>
                <div className={styles.playerImages}>
                    <img className={styles.card} alt="player avatar" src={getAvatar(`liberal-${avatarNumber}`)} />
                    <img className={styles.card} alt="membership" src={membershipImage} />
                </div>
                <span className={styles.playerInfoName}>{playerName}</span>
            </div>
            <FancyButton onClick={closeModal}>
                Acknowledged
            </FancyButton>
        </div>
    )
}

PeekAffiliationModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    avatarNumber: PropTypes.number,
    playerName: PropTypes.string,
    affiliation: PropTypes.string,
}

PeekAffiliationModal.defaultProps = {
    avatarNumber: null,
    playerName: null,
    affiliation: null,
}

export default PeekAffiliationModal
