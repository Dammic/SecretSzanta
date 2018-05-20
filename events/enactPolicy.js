const { PolicyCards, PlayerBoards, SocketEvents } = require('../Dictionary')
const { getCurrentTimestamp } = require('../utils/utils')

module.exports = function (io, RoomsManager, phaseSocketEvents, socketEventsUtils) {
    const policyLogic = {
        updateTrackerPositionIfNecessary: (socket, isSuccess) => {
            if (isSuccess) {
                const trackerPosition = RoomsManager.getFailedElectionsCount(socket.currentRoom)
                socketEventsUtils.resetElectionTracker(socket, trackerPosition)
            } else {
                RoomsManager.increaseFailedElectionsCount(socket.currentRoom)
                socketEventsUtils.sendMessage(socket, { content: 'The failed elections tracker has increased!' })
                const failedElectionsCount = RoomsManager.getFailedElectionsCount(socket.currentRoom)
                if (failedElectionsCount >= 3) {
                    socketEventsUtils.resetElectionTracker(socket, failedElectionsCount)

                    const topCard = RoomsManager.takeChoicePolicyCards(socket.currentRoom, 1)[0]
                    policyLogic.enactPolicy(socket, topCard)
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
            const fascistPolicyCount = RoomsManager.getPolicyCardsCount(socket.currentRoom, PolicyCards.FacistPolicy)
            const playerboardType = RoomsManager.getPlayerboardType(socket.currentRoom)
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
                RoomsManager.toggleVeto(socket.currentRoom)
                socketEventsUtils.sendMessage(socket, { content: 'The veto power has been unlocked! Now president or chancellor can veto any enacted policy!' })
                phaseSocketEvents.startKillPhase(socket)
            } else {
                socketEventsUtils.resumeGame(socket, { delay: 3000, func: phaseSocketEvents.startChancellorChoicePhase })
            }
        },

        enactPolicy: (socket, policy) => {
            const isFacist = policy === PolicyCards.FacistPolicy
            RoomsManager.enactPolicy(socket.currentRoom, policy)
            socketEventsUtils.sendMessage(socket, { content: `A ${isFacist ? 'facist' : 'liberal'} policy has been enacted!` })
            io.sockets.in(socket.currentRoom).emit(SocketEvents.NewPolicy, {
                data: {
                    policy,
                },
            })

            const isVetoUnlocked = RoomsManager.isVetoUnlocked(socket.currentRoom)
            if (isFacist && !isVetoUnlocked) policyLogic.checkForImmediateSuperpowersOrContinue(socket)
        },
    }

    return policyLogic
}
