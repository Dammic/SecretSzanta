'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import VotingModal from './VotingModal/VotingModal'
import ChancellorChoiceModal from './ChancellorChoiceModal/ChancellorChoiceModal'

const GameRoomComponent = ({
    socket,
    userName,
    playersList = [],
    gamePhase,
    isVotingModalShown,
    onVotingModalHide,
    president,
    chancellor,
    onChancellorChoiceHide,
    isChancellorChoiceShown,
    potentialChancellorsChoices,
    chancellorCandidate
}) => {
    return (
        <div className="game-room">
            <ChancellorChoiceModal chancellorsChoices={potentialChancellorsChoices} showModal={isChancellorChoiceShown} onHide={onChancellorChoiceHide} socket={socket}/>
            <VotingModal showModal={isVotingModalShown} onHide={onVotingModalHide} socket={socket} chancellorCandidate={chancellorCandidate} president={president}/>
            <PlayerBoard userName={userName} players={playersList} president={president} chancellor={chancellor} socket={socket} gamePhase={gamePhase}/>
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default GameRoomComponent

