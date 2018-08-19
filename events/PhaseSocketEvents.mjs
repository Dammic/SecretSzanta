import lodash from 'lodash'
import { GamePhases, PlayerAffilications, MessagesTypes } from '../Dictionary'
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

const { forEach, get, truncate } = lodash

export const startChancellorChoicePhaseEvent = ({ currentRoom }, designatedPresidentName = null) => {
    startChancellorChoicePhase(currentRoom, designatedPresidentName)
    emits.emitChancellorChoicePhase(currentRoom)
}

export const startGameEvent = (socket) => {
    startGame(socket.currentRoom)
    const facists = getFacists(socket.currentRoom)

    forEach(facists, player => emits.emitBecomeFascistToPlayer(socket.currentRoom, player, facists))

    emits.emitStartGame(socket.currentRoom)
    SocketEventsUtils.resumeGame(socket, { delay: 10000, func: startChancellorChoicePhaseEvent })
}

export const endGame = ({ currentRoom }) => {
    const { winningSide, reason } = checkWinConditions(currentRoom)
    const winningSideName = winningSide === PlayerAffilications.LIBERAL_AFFILIATION ? 'Liberals' : 'Fascists'

    const messageContent = `${winningSideName} have won - ${reason}`
    emits.emitGameNotification(currentRoom, MessagesTypes.STATUS, messageContent)

    setGamePhase(currentRoom, GamePhases.Ended)

    emits.emitGameFinished(currentRoom, winningSide)
}

export const startVotingPhaseVote = (socket, { playerName: chancellorName }) => {
    initializeVoting(socket.currentRoom, chancellorName)
    const messageContent = `${truncate(chancellorName, 15)} has been nominated to be next chancellor. Voting phase will begin in 10 sec...`
    emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent)

    SocketEventsUtils.resumeGame(socket, {
        delay: 10000,
        func: () => {
            emits.emitVotingPhaseStart(socket.currentRoom, chancellorName)
        },
    })
}

export const startPresidentPolicyChoice = ({ currentRoom }) => {
    const messageContent = 'The president is now choosing which 2 policies the chancellor will choose from...'
    emits.emitGameNotification(currentRoom, MessagesTypes.STATUS, messageContent)

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

    const messageContent = 'The president has gained power to see affiliation of one choosen player. Waiting for his choice...'
    emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent)

    emits.emitChooserPlayer(socket.currentRoom, presidentName)
    emits.emitPeekAffiliationToPresident(socket.currentRoom)
}

export const startPeekCardsPhase = (socket) => {
    setGamePhase(socket.currentRoom, GamePhases.PeekCardsSuperpower)
    const presidentName = get(getPresident(socket.currentRoom), 'playerName')

    const messageContent = 'The president has gained power to see 3 top cards from policies pile. Waiting for confirmation...'
    emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent)

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
