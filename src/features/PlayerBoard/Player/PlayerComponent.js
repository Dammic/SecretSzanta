'use strict'
import React from 'react'
import ChancellorChoiceModal from './ChancellorChoiceModal/ChancellorChoiceModal'

const PlayerComponent = ({
    playerName,
    avatar,
    rolePicture,
    voteBubbleStyle,
    voteBubbleInfo,
    onChancellorChoiceHide,
    isChancellorChoiceShown,
    potentialChancellorsChoices,
    socket
}) => {
    return (
        <div className="player">
            <ChancellorChoiceModal chancellorsChoices={potentialChancellorsChoices} showModal={isChancellorChoiceShown} onHide={onChancellorChoiceHide} socket={socket}/>
            <div>{playerName}</div>
            {voteBubbleInfo && <div className={voteBubbleStyle}>{voteBubbleInfo.voteValue}</div>}
            <img className="portrait" src={avatar} alt="Player image" />
            {rolePicture && <img className="role" src={rolePicture} alt="" />}
        </div>
    )
}

export default PlayerComponent
