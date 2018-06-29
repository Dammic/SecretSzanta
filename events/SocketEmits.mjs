import { io } from '../io'
import { GamePhases, SocketEvents, PlayerRole, PolicyCards, GlobalRoomName } from '../Dictionary'
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
    getRoomDetails,
    getPlayerInfo,
    getRoomDetailsForLobby,
    getRemainingVotesCount,
    getChancellor,
    getVotes,
    getVotingResult
    getHitler,
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
        policyCards: takeChoicePolicyCards(room, 3),
        title: 'Discard one policy and pass the rest to the chancellor',
        role: PlayerRole.ROLE_PRESIDENT,
    })
}

export const emitKillSuperpowerUsed = (room) => {
    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToRoom(room, SocketEvents.KillSuperpowerUsed, {
        presidentName,
        timestamp: getCurrentTimestamp(),
        playersChoices,
    })
}

export const emitDesignateNewPresident = (room) => {
    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToRoom(room, SocketEvents.DesignateNextPresident, {
        presidentName,
        timestamp: getCurrentTimestamp(),
        playersChoices,
    })
}

export const emitSuperpowerAffiliationPeekPlayerChoose = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToPlayer(presidentEmit, SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
        playersChoices,
    })
}

export const emitPeekCards = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    emitToPlayer(presidentEmit, SocketEvents.PeekCards, {
        timestamp: getCurrentTimestamp(),
        cards: peekPolicyCards(room),
    })
}

export const emitServerWaitingForVeto = (room, role) => {
    const roleEmit = getRoleSocket(room, role)

    emitToPlayer(roleEmit, SocketEvents.ServerWaitingForVeto)
}

export const emitSyncPolicies = (room) => emitToRoom(room, SocketEvents.SyncPolicies, {
    facist: getPolicyCardsCount(room, PolicyCards.FacistPolicy),
    liberal: getPolicyCardsCount(room, PolicyCards.LiberalPolicy),
})

export const emitClientLeaveRoom = (room, playerName) => emitToRoom(room, SocketEvents.CLIENT_LEAVE_ROOM, {
    timestamp: getCurrentTimestamp(),
    playerName,
})

export const emitRoomData = (room, emit) => {
    const roomDetails = getRoomDetails(room)
    emitToPlayer(emit, SocketEvents.CLIENT_GET_ROOM_DATA, {
        ...roomDetails,
    })
}

export const emitMessage = (room, emit = null, content, author = null) => {
    const data = {
        content,
        author,
        timestamp: getCurrentTimestamp(),
    }

    if (emit) {
        emitToPlayer(emit, SocketEvents.CLIENT_SEND_MESSAGE, data)
    } else {
        emitToRoom(room, SocketEvents.CLIENT_SEND_MESSAGE, data)
    }
}

export const emitRoomsListChanged = (changedRoom, targetRoom = null) => {
    emitToRoom(GlobalRoomName, SocketEvents.RoomsListChanged, {
        roomName: changedRoom,
        room: targetRoom ? getRoomDetailsForLobby(targetRoom) : null,
    })
}

export const emitAllowEnteringRoom = (room, emit) => {
    emitToPlayer(emit, SocketEvents.AllowEnteringRoom, {
        roomName: room,
    })
}

export const emitClientJoinRoom = (room, playerName) => {
    emitToRoom(room, SocketEvents.CLIENT_JOIN_ROOM, {
        timestamp: getCurrentTimestamp(),
        player: getPlayerInfo(room, playerName),
    })
}

export const emitError = (emit, errorMessage) => {
    emit(SocketEvents.CLIENT_ERROR, { error: errorMessage })
}

export const emitNewVote = (room, playerName) => {
    emitToRoom(room, SocketEvents.VOTING_PHASE_NEWVOTE, {
        playerName,
        remaining: getRemainingVotesCount(room),
        timestamp: getCurrentTimestamp(),
    })
}

export const emitRevealVotingResult = (room) => {
    const hasVotingSucceed = getVotingResult(room)

    emitToRoom(room, SocketEvents.VOTING_PHASE_REVEAL, {
        votes: getVotes(room),
        timestamp: getCurrentTimestamp(),
        newChancellor: (hasVotingSucceed
            ? getChancellor(room).playerName
            : null
        ),
    })
}

export const emitChancellorChoosePolicy = (room, chancellorName) => {
    emitToRoom(room, SocketEvents.ChancellorChoosePolicy, {
        timestamp: getCurrentTimestamp(),
        chancellorName,
    })
}

export const emitChoosePolicyToChancellor = (room, drawnCards) => {
    const chancellorEmit = getRoleSocket(room, PlayerRole.ROLE_CHANCELLOR)

    emitToPlayer(chancellorEmit, SocketEvents.ChoosePolicy, {
        policyCards: drawnCards,
        title: 'Choose policy to enact',
    })
}

export const emitPlayerKilled = (room, playerName) => {
    const hitler = getHitler(room)
    const wasHitler = hitler.playerName === playerName

    emitToRoom(room, SocketEvents.PlayerKilled, {
        wasHitler,
        playerName,
        timestamp: getCurrentTimestamp(),
    })
} 

export const emitPlayerKicked = (room, playerName, wasBanned, isOverlaysHidingNeeded) => {
    emitToRoom(room, SocketEvents.PlayerKicked, {
        playerName,
        timestamp: getCurrentTimestamp(),
        wasBanned,
        isOverlaysHidingNeeded,
    })
}

export const emitSelectName = (emit, newName) => {
    emitToPlayer(emit, SocketEvents.SelectName, { userName: newName })
}

export const emitPeekAffiliation = (room, selectedPlayerName) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    const playerInfo = getPlayerInfo(room, selectedPlayerName)
    if (playerInfo.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
        playerInfo.affiliation = PlayerAffilications.FACIST_AFFILIATION
    }

    emitToPlayer(presidentEmit, SocketEvents.SuperpowerAffiliationPeekAffiliationReveal, { playerInfo })
}
