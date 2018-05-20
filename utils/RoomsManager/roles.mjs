import { roomsStore } from '../../stores'
import lodash from 'lodash'

import {
    PlayerRole,
} from '../../Dictionary'
const {
    reject,
    findIndex,
    sortBy,
    find,
    pick,
    size,
    get,
} = lodash

export const getPlayerRole = (roomName, playerName) => {
    const { playersDict } = roomsStore[roomName]
    return get(playersDict, `${playerName}.role`)
}

export const setChancellor = (roomName) => {
    const { playersDict, chancellorCandidateName } = roomsStore[roomName]

    const previousChancellor = find(playersDict, { role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR })
    if (previousChancellor) {
        previousChancellor.role = null
    }
    const currentChancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })
    if (currentChancellor) {
        currentChancellor.role = PlayerRole.ROLE_PREVIOUS_CHANCELLOR
    }

    if (chancellorCandidateName) {
        const nextChancellor = playersDict[chancellorCandidateName]
        nextChancellor.role = PlayerRole.ROLE_CHANCELLOR
    }
}

export const getChancellor = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const chancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })

    return (chancellor ? pick(chancellor, ['playerName', 'avatarNumber']) : null)
}

export const getChancellorCandidateInfo = (roomName) => {
    const { playersDict, chancellorCandidateName } = roomsStore[roomName]
    const chancellorCandidate = playersDict[chancellorCandidateName]

    return (chancellorCandidate ? pick(chancellorCandidate, ['playerName', 'avatarNumber']) : null)
}

export const setPresident = (roomName, presidentName) => {
    const { playersDict } = roomsStore[roomName]

    const previousPresident = find(playersDict, { role: PlayerRole.ROLE_PREVIOUS_PRESIDENT })
    if (previousPresident) {
        previousPresident.role = null
    }

    const currentPresident = find(playersDict, { role: PlayerRole.ROLE_PRESIDENT })
    if (currentPresident) {
        currentPresident.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
    }

    const nextPresident = playersDict[presidentName]
    nextPresident.role = PlayerRole.ROLE_PRESIDENT
}

export const getPresident = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const president = find(playersDict, { role: PlayerRole.ROLE_PRESIDENT })

    return (president ? pick(president, ['playerName', 'avatarNumber']) : null)
}
export const chooseNextPresident = (roomName) => {
    const { playersDict, previousPresidentNameBackup } = roomsStore[roomName]
    const sortedPlayers = sortBy(reject(playersDict, { isDead: true }), 'slotNumber')

    const lastPresidentIndex = (previousPresidentNameBackup
        ? findIndex(sortedPlayers, { playerName: previousPresidentNameBackup })
        : findIndex(sortedPlayers, { role: PlayerRole.ROLE_PRESIDENT })
    )
    const nextPresidentIndex = (lastPresidentIndex + 1) % size(sortedPlayers)

    const nextPresident = sortedPlayers[nextPresidentIndex]
    setPresident(roomName, nextPresident.playerName)
    if (previousPresidentNameBackup) resetPresidentBackup(roomName)
}
export const getRoleSocket = (roomName, role) => {
    const { playersDict } = roomsStore[roomName]
    return find(playersDict, { role }).emit
}
export const setPresidentBackup = (roomName) => {
    const currentPresident = getPresident(roomName)
    roomsStore[roomName].previousPresidentNameBackup = currentPresident.playerName
}
export const resetPresidentBackup = (roomName) => {
    roomsStore[roomName].previousPresidentNameBackup = null
}

