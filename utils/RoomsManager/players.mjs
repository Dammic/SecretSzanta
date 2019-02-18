import { roomsStore } from '../../stores'
import lodash from 'lodash'
import { GamePhases, PlayerAffilications, ErrorTypes } from '../../Dictionary'
import { setGamePhase } from './gamePhases'
import { logInfo } from '../utils'

const {
    reject,
    tail,
    includes,
    random,
    map,
    find,
    pick,
} = lodash

/**
 * Function that performs adding a new player to a room
 *      It checks if the player is already in the room or if there are no empty slots.
 * @param {String} roomName - unique name of the modified room
 * @param {String} playerName - name of the player to be added to the room
 * @param {Object} socket - Socket.IO socket object of the added player (for contacting with facists)
 */
export const addPlayer = (roomName, playerName, socket) => {
    const { playersDict, freeSlots, gamePhase } = roomsStore[roomName]
    const nextEmptySlot = freeSlots[0]

    if (!includes([GamePhases.GAME_PHASE_NEW, GamePhases.Paused], gamePhase)) {
        logInfo(socket, 'Player tried enter already began game')
        return ErrorTypes.DeniedRoomEntry.BeganGame
    }
    if (!nextEmptySlot) {
        logInfo(socket, 'Player tried to enter full room')
        return ErrorTypes.DeniedRoomEntry.FullRoom
    }
    if (playersDict[playerName]) {
        logInfo(socket, 'The room has player with the same name')
        return ErrorTypes.DeniedRoomEntry.SamePlayerName
    }

    const newPlayer = {
        playerName,
        role: null,
        avatarNumber: random(1, 6),
        facistAvatar: null,
        affiliation: PlayerAffilications.LIBERAL_AFFILIATION,
        slotNumber: nextEmptySlot,
        isDead: false,
        emit: socket.emit.bind(socket),
    }
    playersDict[playerName] = newPlayer
    roomsStore[roomName].freeSlots = tail(freeSlots)
}

/**
 * Function that performs removing a player from a room
 * @param {String} roomName - unique name of the modified room
 * @param {String} playerName - name of the player to be removed from the room
 */
export const removePlayer = (roomName, playerName) => {
    const { playersDict, freeSlots } = roomsStore[roomName]
    const player = playersDict[playerName]

    if (player) {
        freeSlots.unshift(player.slotNumber)
        delete playersDict[playerName]
    }
}

export const getOtherAlivePlayerNames = (roomName, currentPlayerName) => {
    const { playersDict } = roomsStore[roomName]
    const playersChoices = map(reject(playersDict, player => player.isDead || player.playerName === currentPlayerName), 'playerName')
    return playersChoices
}

export const getAlivePlayers = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const playersChoices = reject(playersDict, player => player.isDead)
    return playersChoices
}

export const isInBlackList = (roomName, playerName) => {
    const { blackList } = roomsStore[roomName]
    return includes(blackList, playerName)
}

export const getPlayerInfo = (roomName, playerName) => {
    const { playersDict } = roomsStore[roomName]
    const player = playersDict[playerName]

    return (player
        ? pick(player, ['playerName', 'role', 'affiliation', 'avatarNumber', 'slotNumber'])
        : null
    )
}

export const isRoomOwner = (roomName, playerName) => {
    return playerName === roomsStore[roomName].ownerName
}

export const killPlayer = (roomName, playerName) => {
    const { playersDict } = roomsStore[roomName]

    const player = find(playersDict, { playerName })
    if (player) {
        player.isDead = true
    }
}

export const kickPlayer = (roomName, playerName, banned) => {
    const { playersDict, blackList } = roomsStore[roomName]

    if (banned) {
        blackList.push(playerName)
    }

    setGamePhase(roomName, GamePhases.Paused)
    delete playersDict[playerName]
}
