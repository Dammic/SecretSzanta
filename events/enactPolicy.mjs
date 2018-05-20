import { PolicyCards, PlayerBoards, SocketEvents } from '../Dictionary'
import { getCurrentTimestamp } from '../utils/utils'

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

export default function (io, phaseSocketEvents, socketEventsUtils) {
    const policyLogic = {
        updateTrackerPositionIfNecessary: (socket, isSuccess) => {
            if (isSuccess) {
                const trackerPosition = getFailedElectionsCount(socket.currentRoom)
                socketEventsUtils.resetElectionTracker(socket, trackerPosition)
            } else {
                increaseFailedElectionsCount(socket.currentRoom)
                socketEventsUtils.sendMessage(socket, { content: 'The failed elections tracker has increased!' })
                const failedElectionsCount = getFailedElectionsCount(socket.currentRoom)
                if (failedElectionsCount >= 3) {
                    socketEventsUtils.resetElectionTracker(socket, failedElectionsCount)

                    const topCard = takeChoicePolicyCards(socket.currentRoom, 1)[0]
                    policyLogic.enactPolicyEvent(socket, topCard)
                } else {
                    io.sockets.in(socket.currentRoom).emit(SocketEvents.IncreaseTrackerPosition, {
                        data: {
                            timestamp: getCurrentTimestamp(),
                        },
                    })
                }
            }
        },

        checkForImmediateSuperpowersOrContinue: (socket) => {
            const fascistPolicyCount = getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)
            const playerboardType = getPlayerboardType(socket.currentRoom)
            if (fascistPolicyCount === 1 && playerboardType === PlayerBoards.LargeBoard) {
                phaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
            } else if (fascistPolicyCount === 2 && playerboardType !== PlayerBoards.SmallBoard) {
                phaseSocketEvents.startPeekAffiliationSuperpowerPhase(socket)
            } else if (fascistPolicyCount === 3) {
                if (playerboardType === PlayerBoards.SmallBoard) {
                    // President will see top 3 cards from the drawPile deck
                    phaseSocketEvents.startPeekCardsPhase(socket)
                } else {
                    // President will designate next president superpower
                    phaseSocketEvents.startDesignateNextPresidentPhase(socket)
                }
                // 4th power is always kill on each board
            } else if (fascistPolicyCount === 4) {
                phaseSocketEvents.startKillPhase(socket)
                // 5th power is always kill AND veto power unlock
            } else if (fascistPolicyCount === 5) {
                toggleVeto(socket.currentRoom)
                socketEventsUtils.sendMessage(socket, { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' })
                phaseSocketEvents.startKillPhase(socket)
            } else {
                socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
            }
        },

        enactPolicyEvent: (socket, policy) => {
            const isFacist = policy === PolicyCards.FacistPolicy
            enactPolicy(socket.currentRoom, policy)
            socketEventsUtils.sendMessage(socket, { content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
            io.sockets.in(socket.currentRoom).emit(SocketEvents.NewPolicy, {
                data: {
                    policy,
                },
            })

            const isVeto = isVetoUnlocked(socket.currentRoom)
            if (isFacist && !isVeto ) policyLogic.checkForImmediateSuperpowersOrContinue(socket)
        },
    }

    return policyLogic
}
