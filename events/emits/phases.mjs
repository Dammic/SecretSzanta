import { GamePhases, SocketEvents, MessagesTypes } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'
import lodash from 'lodash'

import { emitToRoom, emitGameNotification } from './generic'

import {
    getFacists,
    getPlayerboardType,
    getChancellorChoices,
    getPresident,
    getRemainingVotesCount,
    getRemainingVotingPlayers,
} from '../../utils/RoomsManager'

const { map, pick, truncate } = lodash

export const emitStartGame = (room) => {
    const messageContent = 'The game has been started. Chancellor choice phase will begin in {counter}...'
    emitGameNotification(room, MessagesTypes.STATUS, messageContent, { counter: 10 })

    emitToRoom(room, SocketEvents.START_GAME, {
        boardType: getPlayerboardType(room),
    })
}

export const emitGameFinished = (room, whoWon) => {
    const facists = getFacists(room)
    const passedFacists = map(facists, facist => pick(facist, ['playerName', 'affiliation', 'facistAvatar']))

    emitToRoom(room, SocketEvents.GameFinished, {
        whoWon,
        facists: passedFacists,
    })
}

export const emitChancellorWillChoosePolicy = (room, chancellorName) => {
    emitToRoom(room, SocketEvents.ChancellorChoosePolicy, {
        timestamp: getCurrentTimestamp(),
        chancellorName,
    })
}

export const emitPresidentWillChoosePolicy = (room) => emitToRoom(room, SocketEvents.PresidentChoosePolicy, {
    timestamp: getCurrentTimestamp(),
    presidentName: getPresident(room).playerName,
    gamePhase: GamePhases.PresidentPolicyChoice,
})

export const emitVotingPhaseStart = (room, chancellorCandidateName) => {
    const remainingPlayers = getRemainingVotingPlayers(room)
    const messageContent = '{votesLeftBold} votes left. Waiting for [{remainingPlayersBold}]'
    emitGameNotification(room, MessagesTypes.STATUS, messageContent, {
        votesLeftBold: getRemainingVotesCount(room),
        remainingPlayersBold: `${truncate(remainingPlayers.join(', '), 40)}…`,
    })

    emitToRoom(
        room,
        SocketEvents.VOTING_PHASE_START,
        {
            chancellorCandidate: chancellorCandidateName,
            timestamp: getCurrentTimestamp(),
        },
    )
}

export const emitChancellorChoicePhase = (room) => {
    const presidentName = getPresident(room).playerName
    const messageContent = `The president ${truncate(presidentName, 15)} is now choosing the candidate for next chancellor...`
    emitGameNotification(room, MessagesTypes.STATUS, messageContent)

    emitToRoom(room, SocketEvents.CHANCELLOR_CHOICE_PHASE, {
        playersChoices: getChancellorChoices(room),
        presidentName,
        timestamp: getCurrentTimestamp(),
    })
}

