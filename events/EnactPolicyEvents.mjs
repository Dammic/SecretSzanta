import { PolicyCards, PlayerBoards } from '../Dictionary'
import SocketEventsUtils from '../utils/SocketEventsUtils'
import PhaseSocketEvents from './PhaseSocketEvents'
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

export const checkForImmediateSuperpowersOrContinue = (socket) => {
    const fascistPolicyCount = getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)
    const playerboardType = getPlayerboardType(socket.currentRoom)
    if (fascistPolicyCount === 1 && playerboardType === PlayerBoards.LargeBoard) {
        PhaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
    } else if (fascistPolicyCount === 2 && playerboardType !== PlayerBoards.SmallBoard) {
        PhaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
    } else if (fascistPolicyCount === 3) {
        if (playerboardType === PlayerBoards.SmallBoard) {
            // President will see top 3 cards from the drawPile deck
            PhaseSocketEvents.startPeekCardsPhase(socket)
        } else {
            // President will designate next president superpower
            PhaseSocketEvents.startDesignateNextPresidentPhase(socket)
        }
        // 4th power is always kill on each board
    } else if (fascistPolicyCount === 4) {
        PhaseSocketEvents.startKillPhase(socket)
        // 5th power is always kill AND veto power unlock
    } else if (fascistPolicyCount === 5) {
        toggleVeto(socket.currentRoom)
        emits.emitMessage(
            socket.currentRoom,
            null,
            { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' },
        )
        PhaseSocketEvents.startKillPhase(socket)
    } else {
        SocketEventsUtils.resumeGame(socket, { delay: 3000, func: PhaseSocketEvents.startChancellorChoicePhaseEvent })
    }
}

export const enactPolicyEvent = (socket, policy) => {
    const isFacist = policy === PolicyCards.FacistPolicy
    enactPolicy(socket.currentRoom, policy)
    emits.emitMessage(socket.currentRoom, null, { content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
    emits.emitNewPolicy(socket.currentRoom, policy)

    const isVeto = isVetoUnlocked(socket.currentRoom)
    if (isFacist && !isVeto) checkForImmediateSuperpowersOrContinue(socket)
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
        } else {
            emits.emitIncreaseTrackerPosition(socket.currentRoom)
        }
    }
}


const EnactPolicyEvents = {
    updateTrackerPositionIfNecessary,
    checkForImmediateSuperpowersOrContinue,
    enactPolicyEvent,
}

export default EnactPolicyEvents
