import { SocketEvents, PlayerRole, PolicyCards } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'

import { emitToRoom, emitToPlayer } from './generic'
import {
    getPolicyCardsCount,
    getRoleSocket,
    takeChoicePolicyCards,
    peekPolicyCards,
} from '../../utils/RoomsManager'

export const emitNewPolicy = (room, policy) => emitToRoom(room, SocketEvents.NewPolicy, { policy })

export const emitPeekCardsToPresident = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    emitToPlayer(presidentEmit, SocketEvents.PeekCards, {
        timestamp: getCurrentTimestamp(),
        cards: peekPolicyCards(room),
    })
}

export const emitSyncPolicies = (room) => emitToRoom(room, SocketEvents.SyncPolicies, {
    facist: getPolicyCardsCount(room, PolicyCards.FacistPolicy),
    liberal: getPolicyCardsCount(room, PolicyCards.LiberalPolicy),
})

export const emitChoosePolicyToChancellor = (room, drawnCards) => {
    const chancellorEmit = getRoleSocket(room, PlayerRole.ROLE_CHANCELLOR)

    emitToPlayer(chancellorEmit, SocketEvents.ChoosePolicy, {
        policyCards: drawnCards,
        title: 'Choose policy to enact',
    })
}

export const emitChoosePolicyToPresident = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)
    emitToPlayer(presidentEmit, SocketEvents.ChoosePolicy, {
        policyCards: takeChoicePolicyCards(room, 3),
        title: 'Discard one policy and pass the rest to the chancellor',
        role: PlayerRole.ROLE_PRESIDENT,
    })
}

