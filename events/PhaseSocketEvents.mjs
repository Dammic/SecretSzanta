import lodash from 'lodash'
import { io } from '../io'
import { SocketEvents, PlayerRole, GamePhases, PlayerAffilications } from '../Dictionary'
import { getCurrentTimestamp } from '../utils/utils'
import SocketEventsUtils from '../utils/SocketEventsUtils'
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
import * as emits from './SocketEmits'

const { forEach, get, map, pick } = lodash

export const startGameEvent = ({ currentRoom, currentPlayerName }) => {
    startGame(currentRoom)
    const facists = getFacists(currentRoom)

    // just filtering out emit functions
    const playerCount = getPlayersCount(currentRoom)

    forEach(facists, player => SocketEventsUtils.sendBecomeFascist(player, playerCount, facists))
    emits.emitStartGame(currentRoom, currentPlayerName)
}

export const endGame = (socket, whoWon) => {
    setGamePhase(socket.currentRoom, GamePhases.Ended)

    emits.emitGameFinished(socket.currentRoom, whoWon);
}

export const startVotingPhaseVote = (socket, { playerName: chancellorName }) => {
    initializeVoting(socket.currentRoom, chancellorName)
    emits.emitVotingPhaseStart(socket.currentRoom, chancellorName);
}

export const startChancellorChoicePhaseEvent = (socket, designatedPresidentName = null) => {
    if (getGamePhase(socket.currentRoom) === GamePhases.GAME_PHASE_SUPERPOWER) return
    startChancellorChoicePhase(socket.currentRoom, designatedPresidentName)

    emits.emitChancellorChoicePhase(socket.currentRoom)
}

export const startPresidentPolicyChoice = (socket) => {
    const presidentEmit = getRoleSocket(socket.currentRoom, 

    setGamePhase(socket.currentRoom, GamePhases.PresidentPolicyChoice)
    emits.emitPresidentChoosePolicy(socket.currentRoom)
    emits.emitChoosePolicy(socket.currentRoom)
}

export const startKillPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.GAME_PHASE_SUPERPOWER)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    const playersChoices = getOtherAlivePlayers(socket.currentRoom, presidentName)
    io.sockets.in(socket.currentRoom).emit(SocketEvents.KillSuperpowerUsed, {
        data: {
            presidentName,
            timestamp: getCurrentTimestamp(),
            playersChoices,
        },
    })
}

export const startDesignateNextPresidentPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.DesignateNextPresidentPhase)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    const playersChoices = getOtherAlivePlayers(socket.currentRoom, presidentName)
    io.sockets.in(socket.currentRoom).emit(SocketEvents.DesignateNextPresident, {
        data: {
            presidentName,
            timestamp: getCurrentTimestamp(),
            playersChoices,
        },
    })
}

export const startPeekAffiliationSuperpowerPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekAffiliationSuperpowerPhase)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
    const playersChoices = getOtherAlivePlayers(socket.currentRoom, presidentName)
    SocketEventsUtils.sendMessage(socket, { content: 'The president has gained power to see affiliation of one player. Waiting for him to decide who to investigate...' })
    SocketEventsUtils.emitSetChooserPlayer(socket, presidentName)

    presidentEmit(SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
        data: {
            playersChoices,
        },
    })
}

export const startPeekCardsPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekCardsSuperpower)
    const presidentEmit = getRoleSocket(socket.currentRoom, PlayerRole.ROLE_PRESIDENT)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    SocketEventsUtils.sendMessage(socket, { content: 'The president has gained power to see next 3 cards, waiting for acknowledgement...' })
    SocketEventsUtils.emitSetChooserPlayer(socket, presidentName)

    presidentEmit(SocketEvents.PeekCards, {
        data: {
            timestamp: getCurrentTimestamp(),
            cards: peekPolicyCards(socket.currentRoom),
        },
    })
}

export const checkIfGameShouldFinish = (socket) => {
    const { winningSide, reason } = checkWinConditions(socket.currentRoom)
    if (!winningSide) {
        return false
    }

    const winningSideName = winningSide === PlayerAffilications.LIBERAL_AFFILIATION ? 'Liberals' : 'Fascists'
    SocketEventsUtils.sendMessage(socket, { content: `${winningSideName} have won - ${reason}` })
    endGame(socket, winningSide)
    return true
}

const PhaseSocketEvents = {
    startGameEvent,
    endGame,
    startVotingPhaseVote,
    startChancellorChoicePhaseEvent,
    startPresidentPolicyChoice,
    startKillPhase,
    startDesignateNextPresidentPhase,
    startPeekAffiliationSuperpowerPhase,
    startPeekCardsPhase,
    checkIfGameShouldFinish,
}

export default PhaseSocketEvents
