import { GamePhases, SocketEvents } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'
import lodash from 'lodash'

import { emitToRoom } from './generic'

import {
    getFacists,
    getPlayerboardType,
    getChancellorChoices,
    getPresident,
} from '../../utils/RoomsManager'

const { map, pick } = lodash
export const emitStartGame = (room, playerName) => emitToRoom(room, SocketEvents.START_GAME, {
    playerName,
    timestamp: getCurrentTimestamp(),
    boardType: getPlayerboardType(room),
})

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

export const emitVotingPhaseStart = (room, chancellorCandidateName) => emitToRoom(
    room,
    SocketEvents.VOTING_PHASE_START,
    {
        chancellorCandidate: chancellorCandidateName,
        timestamp: getCurrentTimestamp(),
    },
)

export const emitChancellorChoicePhase = (room) => emitToRoom(room, SocketEvents.CHANCELLOR_CHOICE_PHASE, {
    playersChoices: getChancellorChoices(room),
    presidentName: getPresident(room).playerName,
    timestamp: getCurrentTimestamp(),
})
