import React from 'react'
import UIBox from '../UIBox/UIBox'
import PlayerBoard from '../PlayerBoard/PlayerBoard'
import VotingModal from './VotingModal/VotingModal'

const GameRoomComponent = () => {
    return (
        <div className="game-room">
            <VotingModal />
            <PlayerBoard />
            <UIBox />
        </div>
    )
}

export default GameRoomComponent

