import React, { PureComponent } from 'react'

const HaltModalComponent = ({ end, owner }) => {
    const information = end ? "The game has ended!" : `The owner ${owner} paused the game.`
    return (
        <div className="halt-body">
            <i className="fa fa-info-circle" aria-hidden="true" />
            <span className="info">{information}</span>
        </div>
    )
}

export default HaltModalComponent
