import { getRoom, updateRoom } from '../../stores'
import lodash from 'lodash'

import { PlayerRole } from '../../Dictionary'
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
    const { playersDict } = getRoom(roomName)
    return get(playersDict, `${playerName}.role`)
}

export const setChancellor = (roomName) => {
    const { playersDict, chancellorCandidateName } = getRoom(roomName)
    const updateObject = { playersDict: {} }

    const previousChancellor = find(playersDict, { role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR })
    if (previousChancellor) {
        updateObject.playersDict[previousChancellor.playerName] = { role: null }
    }

    const currentChancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })
    if (currentChancellor) {
        updateObject.playersDict[currentChancellor.playerName] = { role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR }
    }

    if (chancellorCandidateName) {
        updateObject.playersDict[chancellorCandidateName] = { role: PlayerRole.ROLE_CHANCELLOR }
    }

    updateRoom(roomName, updateObject)
}

export const getChancellor = (roomName) => {
    const { playersDict } = getRoom(roomName)
    const chancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })

    return (chancellor ? pick(chancellor, ['playerName', 'avatarNumber']) : null)
}

export const getChancellorCandidateInfo = (roomName) => {
    const { playersDict, chancellorCandidateName } = getRoom(roomName)
    const chancellorCandidate = playersDict[chancellorCandidateName]

    return (chancellorCandidate ? pick(chancellorCandidate, ['playerName', 'avatarNumber']) : null)
}

export const setPresident = (roomName, presidentName) => {
    const { playersDict } = getRoom(roomName)
    const updateObject = { playersDict: {} }

    const previousPresident = find(playersDict, { role: PlayerRole.ROLE_PREVIOUS_PRESIDENT })
    if (previousPresident) {
        updateObject.playersDict[previousPresident.playerName] = { role: null }
    }

    const currentPresident = find(playersDict, { role: PlayerRole.ROLE_PRESIDENT })
    if (currentPresident) {
        updateObject.playersDict[currentPresident.playerName] = { role: PlayerRole.ROLE_PREVIOUS_PRESIDENT }
    }

    updateObject.playersDict[presidentName] = { role: PlayerRole.ROLE_PRESIDENT }
    updateRoom(roomName, updateObject)
}

export const getPresident = (roomName) => {
    const { playersDict } = getRoom(roomName)
    const president = find(playersDict, { role: PlayerRole.ROLE_PRESIDENT })

    return (president ? pick(president, ['playerName', 'avatarNumber']) : null)
}
export const resetPresidentBackup = (roomName) => {
    updateRoom(roomName, { previousPresidentNameBackup: null })
}
export const chooseNextPresident = (roomName) => {
    const { playersDict, previousPresidentNameBackup } = getRoom(roomName)
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
    const { playersDict } = getRoom(roomName)
    return find(playersDict, { role }).emit
}
export const setPresidentBackup = (roomName) => {
    const currentPresident = getPresident(roomName)
    updateRoom(roomName, { previousPresidentNameBackup: currentPresident.playerName })
}
