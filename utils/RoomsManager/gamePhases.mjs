import { getRoom, updateRoom } from '../../stores'

import {
    setPresident,
    chooseNextPresident,
    setPresidentBackup,
} from './roles'
import { clearVetoVotes } from './veto'

import {
    GamePhases,
} from '../../Dictionary'

export const getGamePhase = (roomName) => {
    return getRoom(roomName).gamePhase
}

export const setGamePhase = (roomName, newPhase) => {
    updateRoom(roomName, { gamePhase: newPhase })
}

export const startChancellorChoicePhase = (roomName, designatedPresidentName) => {
    updateRoom(roomName, { gamePhase: GamePhases.GAME_PHASE_CHANCELLOR_CHOICE })
    clearVetoVotes(roomName)
    if (designatedPresidentName) {
        setPresidentBackup(roomName)
        setPresident(roomName, designatedPresidentName)
    } else {
        chooseNextPresident(roomName)
    }
}
