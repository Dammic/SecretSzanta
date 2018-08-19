import { SocketEvents, PlayerAffilications, PlayerRole, MessagesTypes } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'
import { emitToRoom, emitToPlayer, emitGameNotification } from './generic'
import lodash from 'lodash'

import {
    getPresident,
    getRoleSocket,
    getOtherAlivePlayers,
    peekPolicyCards,
    getPlayerInfo,
    getHitler,
} from '../../utils/RoomsManager'

const { get } = lodash

export const emitPeekAffiliationToPresident = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    emitToPlayer(presidentEmit, SocketEvents.SuperpowerAffiliationPeekPlayerChoose, {
        playersChoices,
    })
}

export const emitServerWaitingForVeto = (room, role) => {
    const roleEmit = getRoleSocket(room, role)

    emitToPlayer(roleEmit, SocketEvents.ServerWaitingForVeto)
}

export const emitPlayerKilled = (room, playerName) => {
    const hitler = getHitler(room)
    const wasHitler = hitler.playerName === playerName

    emitToRoom(room, SocketEvents.PlayerKilled, {
        wasHitler,
        playerName,
        timestamp: getCurrentTimestamp(),
    })
}

export const emitPresidentWillKillPlayer = (room) => {
    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    const messageContent = 'The president has gained power to kill one person! Now the victim is being choosen...'
    emitGameNotification(room, MessagesTypes.STATUS, messageContent)

    emitToRoom(room, SocketEvents.KillSuperpowerUsed, {
        presidentName,
        timestamp: getCurrentTimestamp(),
        playersChoices,
    })
}

export const emitPlayerAffiliationToPresident = (room, selectedPlayerName) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    const playerInfo = getPlayerInfo(room, selectedPlayerName)
    if (playerInfo.affiliation === PlayerAffilications.HITLER_AFFILIATION) {
        playerInfo.affiliation = PlayerAffilications.FACIST_AFFILIATION
    }

    emitToPlayer(presidentEmit, SocketEvents.SuperpowerAffiliationPeekAffiliationReveal, { playerInfo })
}

export const emitDesignateNextPresident = (room) => {
    const presidentName = get(getPresident(room), 'playerName')
    const playersChoices = getOtherAlivePlayers(room, presidentName)

    const messageContent = 'The president has gained power to designate next president for the next round. Waiting for him to choose the next president...'
    emitGameNotification(room, MessagesTypes.STATUS, messageContent)

    emitToRoom(room, SocketEvents.DesignateNextPresident, {
        presidentName,
        timestamp: getCurrentTimestamp(),
        playersChoices,
    })
}

export const emitPeekCardsToPresident = (room) => {
    const presidentEmit = getRoleSocket(room, PlayerRole.ROLE_PRESIDENT)

    emitToPlayer(presidentEmit, SocketEvents.PeekCards, {
        timestamp: getCurrentTimestamp(),
        cards: peekPolicyCards(room),
    })
}

