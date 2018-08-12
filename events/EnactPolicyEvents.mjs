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

// TODO:
// 3) steps: check if game should finish (if yes finish), check if there is any superpower (if yes trigger), otherwise resume game (yes resume)
export const enactPolicyEvent = (socket, policy) => {
    const isFacist = policy === PolicyCards.FacistPolicy
    enactPolicy(socket.currentRoom, policy)
    emits.emitMessage(socket.currentRoom, null, { content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
    emits.emitNewPolicy(socket.currentRoom, policy)
}

export const checkForNextStep = (socket, policy) => {
    const isFacist = policy === PolicyCards.FacistPolicy
    const isVeto = isVetoUnlocked(socket.currentRoom)
    const activeSuperpowerCallback = isFacist ? checkForImmediateSuperpowers(socket) : null

    if (isVeto) {
        triggerVetoPrompt(socket)
    } else if (activeSuperpowerCallback) {
        activeSuperpowerCallback(socket)
    } else if (PhaseSocketEvents.checkIfGameShouldFinish(socket)) {
        // TODO: move ending game logic here
        return
    } else {
        SocketEventsUtils.resumeGame(socket, { delay: 3000, func: PhaseSocketEvents.startChancellorChoicePhaseEvent })
    }
}

export const updateTrackerPositionIfNecessary = (socket, isSuccess) => {
    if (isSuccess) {
        const trackerPosition = getFailedElectionsCount(socket.currentRoom)
        if (trackerPosition > 0) SocketEventsUtils.resetElectionTracker(socket)
    } else {
        increaseFailedElectionsCount(socket.currentRoom)
        emits.emitMessage(socket.currentRoom, null, { content: 'The failed elections tracker has increased!' })
        const failedElectionsCount = getFailedElectionsCount(socket.currentRoom)
        if (failedElectionsCount >= 3) {
            SocketEventsUtils.resetElectionTracker(socket)

            const topCard = takeChoicePolicyCards(socket.currentRoom, 1)[0]
            enactPolicyEvent(socket, topCard)
            checkForNextStep(socket, topCard)
        } else {
            emits.emitIncreaseTrackerPosition(socket.currentRoom)
        }
    }
}


const EnactPolicyEvents = {
    updateTrackerPositionIfNecessary,
    checkForImmediateSuperpowers,
    enactPolicyEvent,
}

export default EnactPolicyEvents
