import lodash from 'lodash'
import { getRoom, updateRoom } from '../../stores'

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
    updateRoom(roomName, { isVetoUnlocked: true })
}
export const addVetoVote = (roomName, playerName) => {
    const { vetoVotes } = getRoom(roomName)
    const playerRole = getPlayerRole(roomName, playerName)
    if (
        includes([PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT], playerRole)
        && !includes(vetoVotes, playerRole)
    ) {
        updateRoom(roomName, { vetoVotes: [...vetoVotes, playerRole] })
    }
}
export const didVetoSucceed = (roomName) => {
    const { vetoVotes } = getRoom(roomName)
    return size(vetoVotes) === 2
}
export const getVetoVotes = (roomName) => {
    return getRoom(roomName).vetoVotes
}
export const clearVetoVotes = (roomName) => {
    updateRoom(roomName, { vetoVotes: [] })
}

export const isVetoUnlocked = (roomName) => {
    return getRoom(roomName).isVetoUnlocked
}
