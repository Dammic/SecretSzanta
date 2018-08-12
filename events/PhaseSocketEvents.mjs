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
import * as emits from './emits'

const { forEach, get } = lodash

export const startGameEvent = ({ currentRoom, currentPlayerName }) => {
    startGame(currentRoom)
    const facists = getFacists(currentRoom)

    forEach(facists, player => emits.emitBecomeFascistToPlayer(currentRoom, player, facists))
    emits.emitStartGame(currentRoom, currentPlayerName)
}

export const endGame = ({ currentRoom }) => {
    const { winningSide, reason } = checkWinConditions(currentRoom)
    const winningSideName = winningSide === PlayerAffilications.LIBERAL_AFFILIATION ? 'Liberals' : 'Fascists'
    emits.emitMessage(currentRoom, null, { content: `${winningSideName} have won - ${reason}` })

    setGamePhase(currentRoom, GamePhases.Ended)

    emits.emitGameFinished(currentRoom, winningSide)
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
    emits.emitPresidentWillChoosePolicy(currentRoom)
    emits.emitChoosePolicyToPresident(currentRoom)
}

export const startKillPhase = ({ currentRoom }) => {
    setGamePhase(currentRoom, GamePhases.GAME_PHASE_SUPERPOWER)
    emits.emitPresidentWillKillPlayer(currentRoom)
}

export const startDesignateNextPresidentPhase = ({ currentRoom }) => {
    setGamePhase(currentRoom, GamePhases.DesignateNextPresidentPhase)
    emits.emitDesignateNextPresident(currentRoom)
}

export const startPeekAffiliationSuperpowerPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekAffiliationSuperpowerPhase)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    emits.emitMessage(
        socket.currentRoom,
        null,
        { content: 'The president has gained power to see affiliation of one player. Waiting for him to decide who to investigate...' },
    )
    emits.emitChooserPlayer(socket.currentRoom, presidentName)
    emits.emitPeekAffiliationToPresident(socket.currentRoom)
}

export const startPeekCardsPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekCardsSuperpower)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')
    emits.emitMessage(
        socket.currentRoom,
        null,
        { content: 'The president has gained power to see next 3 cards, waiting for acknowledgement...' },
    )
    emits.emitChooserPlayer(socket.currentRoom, presidentName)
    emits.emitPeekCardsToPresident(socket.currentRoom)
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
}

export default PhaseSocketEvents
