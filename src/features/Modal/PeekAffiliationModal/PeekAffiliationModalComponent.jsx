import React from 'react'
import PropTypes from 'prop-types'
import { PlayerRole } from '../../../../Dictionary'
import FacistMembershipImage from '../../../static/Facist_Membership.png'
import LiberalMembershipImage from '../../../static/Liberal_Membership.png'

const PeekAffiliationModal = ({
    avatarNumber,
    playerName,
    affiliation,
    closeModal,
}) => {
    console.info(this.props)
    const membershipImage = (affiliation === PlayerRole.FACIST_AFFILIATION ? FacistMembershipImage : LiberalMembershipImage)
    return (
        <div className="peek-affiliation-modal">
            <div className="player-info">
                <div className="player-images">
                    <img className="player-info__avatar" alt="player avatar" src={require(`../../../static/Avatar${avatarNumber}.png`)} />
                    <img className="player-info__affiliation" alt="membership" src={membershipImage} />
                </div>
                <span>{playerName}</span>
            </div>
            <div className="fabulous-button lined thick" onClick={closeModal}>Acknowledged</div>
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
