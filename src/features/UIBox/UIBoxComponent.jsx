import React from 'react'
import PropTypes from 'prop-types'
import Chat from './Chat/Chat'

const UIBoxComponent = ({
    onStartVote,
    onStartGame,
}) => {
    return (
        <div className="ui-box">
            <button onClick={onStartVote}>voting (test)</button>
            <button onClick={onStartGame}>start game (test)</button>
            <Chat />
        </div>
    )
}

UIBoxComponent.propTypes = {
    onStartVote: PropTypes.func,
    onStartGame: PropTypes.func,
}
export default UIBoxComponent
