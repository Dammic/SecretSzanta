import { roomsStore } from '../../stores'
import lodash from 'lodash'

import {
    getPlayerRole,
} from './roles'

import {
    PlayerRole,
} from '../../Dictionary'

const {
    includes,
    size,
} = lodash

export const toggleVeto = (roomName) => {
    roomsStore[roomName].isVetoUnlocked = true
}
export const addVetoVote = (roomName, playerName) => {
    const { vetoVotes } = roomsStore[roomName]
    const playerRole = getPlayerRole(roomName, playerName)
    if (
        includes([PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT], playerRole)
        && !includes(vetoVotes, playerRole)
    ) {
        vetoVotes.push(playerRole)
    }
}
export const didVetoSucceed = (roomName) => {
    const { vetoVotes } = roomsStore[roomName]
    return size(vetoVotes) === 2
}
export const getVetoVotes = (roomName) => {
    return roomsStore[roomName].vetoVotes
}
export const clearVetoVotes = (roomName) => {
    roomsStore[roomName].vetoVotes = []
}

export const isVetoUnlocked = (roomName) => {
    return roomsStore[roomName].isVetoUnlocked
}
