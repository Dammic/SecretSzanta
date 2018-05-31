import { roomsStore } from '../../stores'

import {
    setPresident,
    chooseNextPresident,
    setPresidentBackup,
} from './roles'

import {
    GamePhases,
} from '../../Dictionary'

export const getGamePhase = (roomName) => {
    return roomsStore[roomName].gamePhase
}

export const setGamePhase = (roomName, newPhase) => {
    roomsStore[roomName].gamePhase = newPhase
}

export const startChancellorChoicePhase = (roomName, designatedPresidentName) => {
    roomsStore[roomName].gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
    if (designatedPresidentName) {
        setPresidentBackup(roomName)
        setPresident(roomName, designatedPresidentName)
    } else {
        chooseNextPresident(roomName)
    }
}
