import { io } from '../io'
import { GamePhases, SocketEvents } from '../Dictionary'
import { getCurrentTimestamp } from '../utils/utils'
import lodash from 'lodash'
import {
    getFailedElectionsCount,
    increaseFailedElectionsCount,
    takeChoicePolicyCards,
    getPolicyCardsCount,
    getPlayerboardType,
    toggleVeto,
    enactPolicy,
    isVetoUnlocked,
} from '../utils/RoomsManager'

import {
    getPlayersCount,
    startGame,
    getFacists,
    getPlayerboardType,
    setGamePhase,
    initializeVoting,
    getGamePhase,
    startChancellorChoicePhase,
    getChancellorChoices,
    getPresident,
    getRoleSocket,
    takeChoicePolicyCards,
    getOtherAlivePlayers,
    peekPolicyCards,
    checkWinConditions,
} from '../utils/RoomsManager'

const { forEach, get, map, pick } = lodash

const emitToRoom = (room, eventType, data) => io.sockets.in(room).emit(eventType, { data })
// const emitToPlayer = (palyer, eventType, data) =>
const emitToPlayer = (emit, eventType, data) => emit(eventType, { data })

export const emitNewPolicy = (room, policy) => emitToRoom(room, SocketEvents.NewPolicy, { policy })

export const emitIncreaseTrackerPosition = (room) => emitToRoom(
    room,
    SocketEvents.IncreaseTrackerPosition,
    { timestamp: getCurrentTimestamp() },
)

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

export const emitPresidentChoosePolicy = (room) => emitToRoom(room, SocketEvents.PresidentChoosePolicy, {
    timestamp: getCurrentTimestamp(),
    presidentName: getPresident(room).playerName,
    gamePhase: GamePhases.PresidentPolicyChoice,
})

export const emitChoosePolicyToPresident = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)
    emitToPlayer(presidentEmit, SocketEvents.ChoosePolicy, {
            policyCards: takeChoicePolicyCards(socket.currentRoom, 3),
            title: 'Discard one policy and pass the rest to the chancellor',
            role: PlayerRole.ROLE_PRESIDENT,
    })
}
