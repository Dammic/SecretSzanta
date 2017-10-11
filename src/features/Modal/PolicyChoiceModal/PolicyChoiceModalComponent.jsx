import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { PolicyCards } from '../../../../Dictionary'

const liberalPolicy = require('../../../static/liberalcard.png')
const fascistPolicy = require('../../../static/facistcard.png')

const PolicyChoiceModalComponent = ({
    policies,
    onClick,
}) => {
    return (
        <div className="policy-choice-modal">
            <ul className="policy-list" onClick={onClick}>
                {map(policies, (choice, index) => {
                    const policy = (choice === PolicyCards.LiberalPolicy) ? liberalPolicy : fascistPolicy
                    return (
                        <img key={index} className="policy" src={policy} data-index={index} />
                    )
                })}
            </ul>
        </div>
    )
}

PolicyChoiceModalComponent.propTypes = {
    policies: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
}
export default PolicyChoiceModalComponent
