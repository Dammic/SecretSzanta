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
    presidentName,
    chancellorName,
    onChancellorChoiceHide,
    isChancellorChoiceShown,
    potentialChancellorsChoices,
    chancellorCandidate
}) => {
    return (
        <div className="game-room">
            <ChancellorChoiceModal chancellorsChoices={potentialChancellorsChoices} showModal={isChancellorChoiceShown} onHide={onChancellorChoiceHide} socket={socket}/>
            <VotingModal showModal={isVotingModalShown} onHide={onVotingModalHide} socket={socket} chancellorCandidate={chancellorCandidate} presidentName={presidentName}/>
            <PlayerBoard userName={userName} players={playersList} presidentName={presidentName} chancellorName={chancellorName} socket={socket} gamePhase={gamePhase}/>
            <UIBox socket={socket} userName={userName}/>
        </div>
    )
}

export default GameRoomComponent

