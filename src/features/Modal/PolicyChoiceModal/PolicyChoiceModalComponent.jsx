import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import { map } from 'lodash'
import { PolicyCards } from '../../../../Dictionary'
import { Button } from '../../Shared/Button/Button'

const liberalPolicy = require('../../../static/liberalcard.png')
const fascistPolicy = require('../../../static/facistcard.png')

const PolicyChoiceModalComponent = ({
    policies,
    onClick,
    selectable,
    onButtonClose,
}) => {
    const policyClasses = classNames('policy', { selectable })
    return (
        <div className="policy-choice-modal">
            <ul className="policy-list">
                {map(policies, (choice, index) => {
                    const policy = (choice === PolicyCards.LiberalPolicy) ? liberalPolicy : fascistPolicy
                    return (
                        <img onClick={onClick} alt="policy_card" key={index} className={policyClasses} src={policy} data-index={index} />
                    )
                })}
            </ul>
            {!selectable && (
                <Button
                    onClick={onButtonClose}
                    label="Acknowledged"
                    className="acknowledge-button"
                />
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
