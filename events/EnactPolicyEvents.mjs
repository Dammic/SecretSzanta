import { PolicyCards, PlayerBoards, MessagesTypes } from '../Dictionary'
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
import { TimeDelay } from './consts'
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

            const messageContent = 'The power of veto has been unlocked for next rounds!'
            emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent)

            SocketEventsUtils.resumeGame(socket, { delay: TimeDelay.SHORT_DELAY, func: PhaseSocketEvents.startKillPhase })
        }
    }
    return null
}

export const enactPolicyEvent = (socket, policy) => {
    enactPolicy(socket.currentRoom, policy)
    emits.emitNewPolicy(socket.currentRoom, policy)
}

export const checkForNextStep = (socket, hasPolicyBeenEnacted = false, getCustomNextStep = null, delay = TimeDelay.LONG_DELAY) => {
    const topCard = hasPolicyBeenEnacted ? peekLastEnactedPolicyCard(socket.currentRoom) : null
    const isFacist = topCard === PolicyCards.FacistPolicy
    const activeSuperpowerCallback = isFacist ? checkForImmediateSuperpowers(socket) : null

    let nextStepFunction;
    if (activeSuperpowerCallback) {
        nextStepFunction = activeSuperpowerCallback;
    } else if (checkIfGameShouldFinish(socket.currentRoom)) {
        nextStepFunction = PhaseSocketEvents.endGame;
    } else {
        if (!getCustomNextStep) {
            const messageContent = 'The chancellor choise phase will begin in {counter}…'
            emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, {counter: delay / 1000})
            nextStepFunction = PhaseSocketEvents.startChancellorChoicePhaseEvent;
        }
        else {
            nextStepFunction = getCustomNextStep(delay);
        }
    }

    SocketEventsUtils.resumeGame(socket, { delay, func: nextStepFunction })
}

export const increaseElectionTracker = ({ currentRoom }) => {
    increaseFailedElectionsCount(currentRoom)
    emits.emitIncreaseTrackerPosition(currentRoom)
}

export const resetElectionTracker = ({ currentRoom }) => {
    resetFailedElectionsCount(currentRoom)
    emits.emitResetTracker(currentRoom)
}

export const resetElectionTrackerAndEnactPolicy = (socket) => {
    resetElectionTracker(socket)

    const topCard = takeChoicePolicyCards(socket.currentRoom, 1)[0]
    const policyName = topCard === PolicyCards.FacistPolicy ? 'fascist' : 'liberal'

    const messageContent = 'The failed elections tracker has reached 3 and will be reset, enacting a {policyNameBold} policy!'
    emits.emitGameNotification(socket.currentRoom, MessagesTypes.STATUS, messageContent, { policyNameBold: policyName })

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
