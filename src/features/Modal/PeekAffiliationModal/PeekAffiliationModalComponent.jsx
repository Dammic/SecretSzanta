import React from 'react'
import PropTypes from 'prop-types'
import { PlayerAffilications } from '../../../../Dictionary'
import { getAvatar } from '../../../utils/avatarsHelper'
import FacistMembershipImage from '../../../static/Facist_Membership.png'
import LiberalMembershipImage from '../../../static/Liberal_Membership.png'
import { Button } from '../../Shared/Button/Button'

const PeekAffiliationModal = ({
    avatarNumber,
    playerName,
    affiliation,
    closeModal,
}) => {
    const membershipImage = (affiliation === PlayerAffilications.FACIST_AFFILIATION ? FacistMembershipImage : LiberalMembershipImage)
    return (
        <div className="peek-affiliation-modal">
            <div className="player-info">
                <div className="player-images">
                    <img className="card" alt="player avatar" src={getAvatar(`liberal-${avatarNumber}`)} />
                    <img className="card" alt="membership" src={membershipImage} />
                </div>
                <span className="player-info__name">{playerName}</span>
            </div>
            <Button
                onClick={closeModal}
                label="Acknowledged"
            />
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
