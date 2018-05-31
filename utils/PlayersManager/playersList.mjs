import lodash from 'lodash'
import {
    GlobalRoomName,
} from '../../Dictionary'
import { playersStore } from '../../stores'

const { random } = lodash

export const getPlayersList = () => {
    return playersStore
}

export const getPlayerFromPlayersList = (userName) => {
    return playersStore[userName]
}

export const isInPlayersList = (userName) => {
    return !!playersStore[userName]
}

export const addPlayerToPlayersList = (userName) => {
    playersStore[userName] = {
        avatarNumber: random(1, 6),
        playerName: userName,
        currentRoom: null,
    }
}
export const removePlayerFromPlayersList = (userName) => {
    if (userName) {
        delete playersStore[userName]
    }
}
export const updatePlayerRoom = (userName, newRoomName) => {
    playersStore[userName].currentRoom = (newRoomName === GlobalRoomName ? '' : newRoomName)
}
