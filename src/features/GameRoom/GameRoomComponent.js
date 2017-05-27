'use strict'
import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import VotingModal from './VotingModal/VotingModal'
import ChancellorChoiceModal from './ChancellorChoiceModal/ChancellorChoiceModal'

const GameRoomComponent = () => {
    return (
        <div className="game-room">
            <ChancellorChoiceModal />
            <VotingModal />
            <PlayerBoard />
            <UIBox />
        </div>
    )
}

export default GameRoomComponent

