import React from 'react'
import PropTypes from 'prop-types'
import { PlayerRole } from '../../../../Dictionary'
import { FancyButton } from '../../Shared/Buttons'
import { getAvatar } from '../../../utils/avatarsHelper'
import PresidentRoleImage from '../../../static/President.png'
import ChancellorRoleImage from '../../../static/Chancellor.png'
import { Icon } from '../../Shared/Icon'

import commonStyles from '../../Shared/CommonStyles/commonStyles.css'
import styles from './VotingModal.css'

const VotingModalComponent = ({
    onYesVote,
    onNoVote,
    president,
    chancellorCandidate,
}) => {
    const renderPlayer = (avatarNumber, role, playerName) => {
        return (
            <div className={styles.votingInfoPlayer}>
                <img className={styles.votingInfoAvatar} src={getAvatar(`liberal-${avatarNumber}`)}></img>
                <img className={styles.votingInfoRole} src={(role === PlayerRole.ROLE_PRESIDENT ? PresidentRoleImage : ChancellorRoleImage)}></img>
                <span className={commonStyles.ellipsis}>{playerName}</span>
            </div>
        )
    }
    if (!chancellorCandidate || !president) return null

    return (
        <React.Fragment>
            <div className={styles.votingInfoContainer}>
                {renderPlayer(president.avatarNumber, PlayerRole.ROLE_PRESIDENT, president.playerName)}
                <div className={styles.choiceOrderContainer}>
                    <div><Icon name="fa-angle-double-right" /></div>
                    <div>Nominates</div>
                </div>
                {renderPlayer(chancellorCandidate.avatarNumber, PlayerRole.ROLE_CHANCELLOR, chancellorCandidate.playerName)}
            </div>
            <div className={styles.votingIntro}>The president nominates <strong>{chancellorCandidate.playerName}</strong> for a new chancellor!</div>
            <div className={styles.votingIntro}>Do you agree?</div>
            <div className={styles.votingButtonsContainer}>
                <FancyButton onClick={onYesVote}>Jaa!</FancyButton>
                <FancyButton onClick={onNoVote}>Nein!</FancyButton>
            </div>
        </React.Fragment>
    )
}

VotingModalComponent.propTypes = {
    onYesVote: PropTypes.func.isRequired,
    onNoVote: PropTypes.func.isRequired,
    president: PropTypes.shape({
        avatarNumber: PropTypes.number.isRequired,
        playerName: PropTypes.string.isRequired,
    }),
    chancellorCandidate: PropTypes.shape({
        avatarNumber: PropTypes.number.isRequired,
        playerName: PropTypes.string.isRequired,
    }),
}

export default VotingModalComponent
