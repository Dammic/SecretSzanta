import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { map } from 'lodash'
import { PolicyCards } from '../../../../Dictionary'
import { FancyButton } from '../../Shared/Buttons'

import styles from './PolicyChoiceModal.module.css'

const liberalPolicy = require('../../../static/liberalcard.png')
const fascistPolicy = require('../../../static/facistcard.png')


const PolicyChoiceModalComponent = ({
    policies,
    onClick,
    selectable,
    onButtonClose,
}) => {
    const policyClasses = classNames(styles.policy, { [styles.selectable]: selectable })
    return (
        <div className={styles.policyChoiceModal}>
            <ul className={styles.policyList}>
                {map(policies, (choice, index) => {
                    const policy = (choice === PolicyCards.LiberalPolicy) ? liberalPolicy : fascistPolicy
                    return (
                        <img onClick={onClick} alt="policy_card" key={index} className={policyClasses} src={policy} data-index={index} />
                    )
                })}
            </ul>
            {!selectable && (
                <FancyButton
                    onClick={onButtonClose}
                    className={styles.acknowledgeButton}
                >
                    Acknowledged
                </FancyButton>
            )}
        </div>
    )
}

PolicyChoiceModalComponent.propTypes = {
    policies: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
    selectable: PropTypes.bool,
    onButtonClose: PropTypes.func,
}
export default PolicyChoiceModalComponent
