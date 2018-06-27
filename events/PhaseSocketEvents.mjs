import lodash from 'lodash'
import { GamePhases, PlayerAffilications } from '../Dictionary'
import SocketEventsUtils from '../utils/SocketEventsUtils'
import {
    getPlayersCount,
    startGame,
    getFacists,
    setGamePhase,
    initializeVoting,
    getGamePhase,
    startChancellorChoicePhase,
    getPresident,
    checkWinConditions,
} from '../utils/RoomsManager'
import * as emits from './SocketEmits'

const { forEach, get } = lodash

export const startGameEvent = ({ currentRoom, currentPlayerName }) => {
    startGame(currentRoom)
    const facists = getFacists(currentRoom)

    // just filtering out emit functions
    const playerCount = getPlayersCount(currentRoom)

    forEach(facists, player => SocketEventsUtils.sendBecomeFascist(player, playerCount, facists))
    emits.emitStartGame(currentRoom, currentPlayerName)
}

export const endGame = ({ currentRoom }, whoWon) => {
    setGamePhase(currentRoom, GamePhases.Ended)

    emits.emitGameFinished(currentRoom, whoWon)
}

export const startVotingPhaseVote = ({ currentRoom }, { playerName: chancellorName }) => {
    initializeVoting(currentRoom, chancellorName)
    emits.emitVotingPhaseStart(currentRoom, chancellorName)
}

export const startChancellorChoicePhaseEvent = ({ currentRoom }, designatedPresidentName = null) => {
    if (getGamePhase(currentRoom) === GamePhases.GAME_PHASE_SUPERPOWER) return
    startChancellorChoicePhase(currentRoom, designatedPresidentName)

    emits.emitChancellorChoicePhase(currentRoom)
}

export const startPresidentPolicyChoice = ({ currentRoom }) => {
    setGamePhase(currentRoom, GamePhases.PresidentPolicyChoice)
    emits.emitPresidentChoosePolicy(currentRoom)
    emits.emitChoosePolicyToPresident(currentRoom)
}

export const startKillPhase = ({ currentRoom }) => {
    setGamePhase(currentRoom, GamePhases.GAME_PHASE_SUPERPOWER)
    emits.emitKillSuperpowerUsed(currentRoom)
}

export const startDesignateNextPresidentPhase = ({ currentRoom }) => {
    setGamePhase(currentRoom, GamePhases.DesignateNextPresidentPhase)
    emits.emitToRoom(currentRoom)
}

export const startPeekAffiliationSuperpowerPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekAffiliationSuperpowerPhase)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    SocketEventsUtils.sendMessage(
        socket,
        { content: 'The president has gained power to see affiliation of one player. Waiting for him to decide who to investigate...' },
    )
    SocketEventsUtils.emitSetChooserPlayer(socket, presidentName)
    emits.emitSuperpowerAffiliationPeekPlayerChoose(socket.currentRoom)
}

export const startPeekCardsPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekCardsSuperpower)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    SocketEventsUtils.sendMessage(
        socket,
        { content: 'The president has gained power to see next 3 cards, waiting for acknowledgement...' },
    )
    SocketEventsUtils.emitSetChooserPlayer(socket, presidentName)
    emits.emitPeekCards(socket.currentRoom)
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
