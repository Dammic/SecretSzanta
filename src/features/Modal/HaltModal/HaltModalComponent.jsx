import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const HaltModalComponent = ({ hasGameEnded, ownerName }) => {
    const information = hasGameEnded ? "The game has ended!" : `The owner ${ownerName} has paused the game.`
    return (
        <div className="halt-body">
            <i className="fa fa-pause" aria-hidden="true" />
            <span className="info">{information}</span>
        </div>
    )
}

HaltModalComponent.propTypes = {
    hasGameEnded: PropTypes.bool,
    ownerName: PropTypes.string,
}

export default HaltModalComponent
