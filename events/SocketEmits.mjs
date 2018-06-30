import { io } from '../io'
import { GamePhases, SocketEvents,PlayerAffilications, PlayerRole, PolicyCards, GlobalRoomName } from '../Dictionary'
import { getCurrentTimestamp } from '../utils/utils'
import lodash from 'lodash'

import {
    getFailedElectionsCount,
    increaseFailedElectionsCount,
    getPolicyCardsCount,
    toggleVeto,
    enactPolicy,
    isVetoUnlocked,
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
    getRoomsList,
    getRoomDetails,
    getPlayerInfo,
    getRoomDetailsForLobby,
    getRemainingVotesCount,
    getChancellor,
    getVotes,
    getVotingResult,
    getHitler,
} from '../utils/RoomsManager'
import {
    updatePlayerRoom,
    getPlayersList,
    getPlayerFromPlayersList,
} from '../utils/PlayersManager'

const { forEach, get, map, pick } = lodash

const emitToRoom = (room, eventType, data) => io.sockets.in(room).emit(eventType, { data })

const emitToPlayer = (emit, eventType, data) => emit(eventType, { data })

export const emitIncreaseTrackerPosition = (room) => emitToRoom(
    room,
    SocketEvents.IncreaseTrackerPosition,
    { timestamp: getCurrentTimestamp() },
)

export const emitNewPresidentDesignated = (room) => {
    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToRoom(room, SocketEvents.DesignateNextPresident, {
        presidentName,
        timestamp: getCurrentTimestamp(),
        playersChoices,
    })
}

export const emitPeekAffiliationToPresident = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToPlayer(presidentEmit, SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
        playersChoices,
    })
}

export const emitServerWaitingForVeto = (room, role) => {
    const roleEmit = getRoleSocket(room, role)

    emitToPlayer(roleEmit, SocketEvents.ServerWaitingForVeto)
}

export const emitPlayerLeftRoom = (room, playerName) => emitToRoom(room, SocketEvents.CLIENT_LEAVE_ROOM, {
    timestamp: getCurrentTimestamp(),
    playerName,
})

export const emitRoomData = (room, emit) => {
    const roomDetails = getRoomDetails(room)
    emitToPlayer(emit, SocketEvents.CLIENT_GET_ROOM_DATA, {
        ...roomDetails,
    })
}

export const emitMessage = (room, emit = null, { content, author = null }) => {
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

export const emitPlayersListChanged = (playerName) => {
    emitToRoom(GlobalRoomName, SocketEvents.PlayersListChanged, {
        playerName,
        player: getPlayerFromPlayersList(playerName),
    })
}

export const emitAllowEnteringRoom = (room, emit) => {
    emitToPlayer(emit, SocketEvents.AllowEnteringRoom, {
        roomName: room,
    })
}

export const emitPlayerJoinedRoom = (room, playerName) => {
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

export const emitVotingResult = (room) => {
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

export const emitPlayerKilled = (room, playerName) => {
    const hitler = getHitler(room)
    const wasHitler = hitler.playerName === playerName

    emitToRoom(room, SocketEvents.PlayerKilled, {
        wasHitler,
        playerName,
        timestamp: getCurrentTimestamp(),
    })
}

export const emitPresidentWillKillPlayer = (room) => {
    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToRoom(room, SocketEvents.KillSuperpowerUsed, {
        presidentName,
        timestamp: getCurrentTimestamp(),
        playersChoices,
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

export const emitSelectNameToPlayer = (emit, newName) => {
    emitToPlayer(emit, SocketEvents.SelectName, { userName: newName })
}

export const emitPlayerAffiliationToPresident = (room, selectedPlayerName) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    const playerInfo = getPlayerInfo(room, selectedPlayerName)
    if (playerInfo.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
        playerInfo.affiliation = PlayerAffilications.FACIST_AFFILIATION
    }

    emitToPlayer(presidentEmit, SocketEvents.SuperpowerAffiliationPeekAffiliationReveal, { playerInfo })
}

export const emitChooserPlayer = (room, playerName) => {
    emitToRoom(room, SocketEvents.SetChooserPlayer, { playerName })
}

export const emitSetTimer = (room, delay) => {
    emitToRoom(room, SocketEvents.SetTimer, { waitTime: delay })
}

export const emitBecomeFascistToPlayer = (room, player, fascists) => {
    const playerCount = getPlayersCount(room)
    const shouldHideOtherFacists = player.affiliation === PlayerAffilications.HITLER_AFFILIATION && playerCount > 6
    const facistSubproperties = ['playerName', 'affiliation', 'facistAvatar']
    const passedFacists = map(fascists, fascist => pick(fascist, facistSubproperties))

    emitToPlayer(player.emit, SocketEvents.BECOME_FACIST, {
        facists: (shouldHideOtherFacists
            ? pick(player, facistSubproperties)
            : passedFacists
        ),
    })
}

export const emitResetTracker = (room) => {
    emitToRoom(room, SocketEvents.ResetTracker, { timestamp: getCurrentTimestamp() })
}

export const emitSyncLobbyToPlayer = (emit) => {
    emitToPlayer(emit, SocketEvents.SyncLobby, {
        players: getPlayersList(),
        rooms: getRoomsList(),
    })
}

