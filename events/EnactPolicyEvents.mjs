import { PolicyCards, PlayerBoards } from '../Dictionary'
import SocketEventsUtils from '../utils/SocketEventsUtils'
import PhaseSocketEvents from './PhaseSocketEvents'
import {
    triggerVetoPrompt,
} from './SocketEvents'
import {
    getFailedElectionsCount,
    increaseFailedElectionsCount,
    takeChoicePolicyCards,
    getPolicyCardsCount,
    getPlayerboardType,
    toggleVeto,
    enactPolicy,
    isVetoUnlocked,
    getVetoVotes,
    checkIfGameShouldFinish,
    peekLastEnactedPolicyCard,
    resetFailedElectionsCount,
} from '../utils/RoomsManager'
import * as emits from './emits'

export const checkForImmediateSuperpowers = ({ currentRoom }) => {
    const fascistPolicyCount = getPolicyCardsCount(currentRoom, PolicyCards.FacistPolicy)
    const playerboardType = getPlayerboardType(currentRoom)

    if (fascistPolicyCount === 1 && playerboardType === PlayerBoards.LargeBoard) {
        return PhaseSocketEvents.startPeekAffiliationSuperpowerPhase
    }
    if (fascistPolicyCount === 2 && playerboardType !== PlayerBoards.SmallBoard) {
        return PhaseSocketEvents.startPeekAffiliationSuperpowerPhase
    }
    if (fascistPolicyCount === 3) {
        if (playerboardType === PlayerBoards.SmallBoard) {
            // President will see top 3 cards from the drawPile deck
            return PhaseSocketEvents.startPeekCardsPhase
        }
        // President will designate next president superpower
        return PhaseSocketEvents.startDesignateNextPresidentPhase
    }
    // 4th power is always kill on each board
    if (fascistPolicyCount === 4) {
        return PhaseSocketEvents.startKillPhase
    }
    // 5th power is always kill AND veto power unlock
    if (fascistPolicyCount === 5) {
        return (socket) => {
            toggleVeto(socket.currentRoom)
            emits.emitMessage(
                socket.currentRoom,
                null,
                { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' },
            )
            PhaseSocketEvents.startKillPhase(socket)
        }
    }
    return null
}

export const enactPolicyEvent = (socket, policy) => {
    const isFacist = policy === PolicyCards.FacistPolicy
    enactPolicy(socket.currentRoom, policy)
    emits.emitMessage(socket.currentRoom, null, { content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
    emits.emitNewPolicy(socket.currentRoom, policy)
}

export const checkForNextStep = (socket, hasPolicyBeenEnacted = false, customResumeFunc = null) => {
    const topCard = hasPolicyBeenEnacted ? peekLastEnactedPolicyCard(socket.currentRoom) : null
    const isFacist = topCard === PolicyCards.FacistPolicy
    const activeSuperpowerCallback = isFacist ? checkForImmediateSuperpowers(socket) : null

    if (activeSuperpowerCallback) {
        activeSuperpowerCallback(socket)
    } else if (checkIfGameShouldFinish(socket.currentRoom)) {
        PhaseSocketEvents.endGame(socket)
    } else {
        SocketEventsUtils.resumeGame(socket, { delay: 10000, func: customResumeFunc || PhaseSocketEvents.startChancellorChoicePhaseEvent })
    }
}

export const increaseElectionTracker = ({ currentRoom }) => {
    increaseFailedElectionsCount(currentRoom)
    emits.emitMessage(currentRoom, null, { content: 'The failed elections tracker has increased!' })
}

export const resetElectionTracker = (socket) => {
    const trackerPosition = getFailedElectionsCount(socket.currentRoom)

    resetFailedElectionsCount(socket.currentRoom)
    emits.emitResetTracker()

    const trackerMessage = `The failed elections tracker${trackerPosition === 3 ? ' has reached 3, so it' : ''} will be reset!`
    emits.emitMessage(socket.currentRoom, null, { content: trackerMessage })
}

export const resetElectionTrackerAndEnactPolicy = (socket) => {
    resetElectionTracker(socket)

    const topCard = takeChoicePolicyCards(socket.currentRoom, 1)[0]
    enactPolicyEvent(socket, topCard)
}

export const updateTrackerPosition = (socket, isSuccess) => {
    if (isSuccess) { // rest election tracker
        const trackerPosition = getFailedElectionsCount(socket.currentRoom)
        if (trackerPosition > 0) resetElectionTracker(socket)
        return false
    } else {
        increaseElectionTracker(socket)
        const failedElectionsCount = getFailedElectionsCount(socket.currentRoom)
        if (failedElectionsCount >= 3) {
            resetElectionTrackerAndEnactPolicy(socket)
            return true
        }
        return false
    }
}


const EnactPolicyEvents = {
    updateTrackerPosition,
    checkForImmediateSuperpowers,
    enactPolicyEvent,
    increaseElectionTracker,
    resetElectionTracker,
    resetElectionTrackerAndEnactPolicy
}

export default EnactPolicyEvents
