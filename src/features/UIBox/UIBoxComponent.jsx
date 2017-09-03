import React from 'react'
import PropTypes from 'prop-types'
import Chat from './Chat/Chat'

const UIBoxComponent = ({
    onStartVote,
    onStartGame,
    onKillClick,
}) => {
    return (
        <div className="ui-box">
            <button onClick={onStartVote}>voting (test)</button>
            <button onClick={onStartGame}>start game (test)</button>
            <button onClick={onKillClick}>start kill (test - use only after vote success)</button>
            <Chat />
        </div>
    )
}

UIBoxComponent.propTypes = {
    onStartVote: PropTypes.func,
    onStartGame: PropTypes.func,
}
export default UIBoxComponent
