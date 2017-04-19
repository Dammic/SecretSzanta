'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import VotingModal from './VotingModal/VotingModal'

const GameRoomComponent = ({
    socket,
    userName,
    playersList = [],
    chancellorCandidateName,
    gamePhase,
    isVotingModalShown,
    hideModal
}) => {
    return (
        <div className="game-room">
            <VotingModal showModal={isVotingModalShown} onHide={hideModal} socket={socket}/>
            <PlayerBoard userName={userName} players={playersList}/>
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default GameRoomComponent

