import lodash from 'lodash'
import {
    GamePhases,
    PlayerRole,
    PlayerAffilications,
    PolicyCards,
    PlayerBoards,
    WinReasons,
} from '../../Dictionary'

import {
    getPolicyCardsCount,
} from './policies'

import { logInfo } from '../../utils/utils'
import { roomsStore } from '../../stores'

const {
    values, mapValues, isNil,
    forEach, random, slice, times, map,
    find, pick, shuffle, size, sample, get, concat, fill,
} = lodash

/**
 * This function contains methods to manage rooms variables and rooms.
 * @returns {Object} - set of functions for maintaining rooms variables
 */
/**
 * Function initializing rooms handler. It initializes default variables for the room,
 *      as well as empty slots for players
 * @param {String} roomName - unique name of the modified room
 * @param {Number} [maxPlayers = 10] - max amount of players in the room
 */
export const initializeRoom = (roomName, ownerName, maxPlayers = 10, password) => {
    let freeSlots = []
    times(maxPlayers, index => freeSlots.push(index + 1))
    logInfo({
        currentRoom: roomName,
        currentPlayerName: ownerName,
    }, 'New room was created by the player')

    roomsStore[roomName] = {
        ownerName,
        freeSlots,
        playersDict: {},
        blackList: [],
        maxPlayers,
        password,
        chancellorCandidateName: '',
        failedElectionsCount: 0,
        votes: {},
        gamePhase: GamePhases.GAME_PHASE_NEW,
        drawPile: [],
        drawnCards: [],
        discardPile: [],
        policiesPile: [],
        isVetoUnlocked: false,
        vetoVotes: [],
        boardType: null,
        // this president will be set as president at the start of the turn, before choosing normal president, only once
        previousPresidentNameBackup: null,
    }
}

export const setPlayerboardType = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const playersCount = size(playersDict)
    let boardType
    if (playersCount <= 6) {
        boardType = PlayerBoards.SmallBoard
    } else if (playersCount <= 8) {
        boardType = PlayerBoards.MediumBoard
    } else if (playersCount <= 10) {
        boardType = PlayerBoards.LargeBoard
    }
    roomsStore[roomName].boardType = boardType
}

export const startGame = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    roomsStore[roomName].gamePhase = GamePhases.START_GAME
    roomsStore[roomName].failedElectionsCount = 0
    setPlayerboardType(roomName)
    forEach(playersDict, player => player.affiliation = PlayerAffilications.LIBERAL_AFFILIATION)

    const liberalCount = Math.floor(size(playersDict) / 2) + 1
    const facistCount = size(playersDict) - liberalCount

    // selecting random facists and hitler
    const shuffledPlayers = map(shuffle(values(playersDict)), 'playerName')
    const hitlerPlayerName = shuffledPlayers[0]
    const selectedFacists = slice(shuffledPlayers, 1, facistCount)
    forEach(selectedFacists, (playerName) => {
        playersDict[playerName].affiliation = PlayerAffilications.FACIST_AFFILIATION
        playersDict[playerName].facistAvatar = random(21, 21)
    })
    playersDict[hitlerPlayerName].affiliation = PlayerAffilications.HITLER_AFFILIATION
    playersDict[hitlerPlayerName].facistAvatar = 50

    // creating policy cards
    const fascistCards = fill(Array(11), PolicyCards.FacistPolicy)
    const liberalCards = fill(Array(6), PolicyCards.LiberalPolicy)
    roomsStore[roomName] = {
        ...roomsStore[roomName],
        drawPile: shuffle(concat(fascistCards, liberalCards)),
        drawnCards: [],
        discardPile: [],
        policiesPile: [],
    }
}

export const getRoomsList = () => {
    return mapValues(roomsStore, (room, key) => ({
        roomId: key,
        roomName: key,
        maxPlayers: room.maxPlayers,
        playersCount: size(room.playersDict),
    }))
}

export const getRoomDetailsForLobby = (roomName) => {
    const room = roomsStore[roomName]
    if (!room) return null
    return {
        roomName,
        roomId: roomName,
        maxPlayers: room.maxPlayers,
        playersCount: size(room.playersDict),
    }
}

export const getRoomDetails = (roomName) => {
    const {
        playersDict,
        ownerName,
        maxPlayers,
        gamePhase,
        failedElectionsCount,
        boardType,
    } = roomsStore[roomName]
    return {
        maxPlayers,
        gamePhase,
        ownerName,
        boardType,
        trackerPosition: failedElectionsCount,
        playersDict: mapValues(playersDict, (player) => {
            let genericInfo = pick(player, ['playerName', 'avatarNumber'])
            genericInfo.affiliation = PlayerAffilications.LIBERAL_AFFILIATION
            return genericInfo
        }),
    }
}

/**
 * Function that checks if the room is defined or not
 * @param roomName - id of a room
 * @returns {Boolean} - true if created, false if not created
 */
export const isRoomPresent = (roomName) => {
    return !isNil(roomsStore[roomName])
}

export const getRoomOwner = (roomName) => {
    const { playersDict, ownerName } = roomsStore[roomName]
    return playersDict[ownerName]
}

export const findNewRoomOwner = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const newOwner = sample(playersDict)
    roomsStore[roomName].ownerName = get(newOwner, 'playerName')
    return newOwner
}

export const getPlayersCount = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    return size(playersDict)
}

export const removeRoom = (roomName) => {
    delete roomsStore[roomName]
}


export const getPlayerboardType = (roomName) => {
    return roomsStore[roomName].boardType
}

export const checkWinConditions = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const hitler = find(playersDict, (player => player.affiliation === PlayerAffilications.HITLER_AFFILIATION))
    const fascistPoliciesCount = getPolicyCardsCount(roomName, PolicyCards.FacistPolicy)
    const liberalPoliciesCount = getPolicyCardsCount(roomName, PolicyCards.LiberalPolicy)
    if (liberalPoliciesCount === 5) {
        return { winningSide: PlayerAffilications.LIBERAL_AFFILIATION, reason: WinReasons.fiveLiberalCards }
    } else if (hitler.isDead) {
        return { winningSide: PlayerAffilications.LIBERAL_AFFILIATION, reason: WinReasons.hitlerDead }
    } else if (fascistPoliciesCount === 6) {
        return { winningSide: PlayerAffilications.FACIST_AFFILIATION, reason: WinReasons.sixFascistCards }
    } else if (fascistPoliciesCount >= 4 && hitler.role === PlayerRole.ROLE_CHANCELLOR) {
        return { winningSide: PlayerAffilications.FACIST_AFFILIATION, reason: WinReasons.hitlerBecameChancellor }
    }
    return { winningSide: null, reason: null }
}
