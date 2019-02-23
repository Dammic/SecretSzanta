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
import { getRoom, getAllRooms, updateRoom, deleteRoom, createRoom } from '../../stores'

const {
    values, mapValues, isNil,
    forEach, random, slice, times, map,
    find, pick, shuffle, size, sample, get, fill,
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

    createRoom(roomName, {
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
    })
}

export const setPlayerboardType = (roomName) => {
    const { playersDict } = getRoom(roomName)
    const playersCount = size(playersDict)
    let boardType
    if (playersCount <= 6) {
        boardType = PlayerBoards.SmallBoard
    } else if (playersCount <= 8) {
        boardType = PlayerBoards.MediumBoard
    } else if (playersCount <= 10) {
        boardType = PlayerBoards.LargeBoard
    }
    updateRoom(roomName, 'boardType', boardType)
}

export const startGame = (roomName) => {
    const { playersDict } = getRoom(roomName)
    updateRoom(roomName, 'gamePhase', GamePhases.START_GAME)
    updateRoom(roomName, 'failedElectionsCount', 0)
    setPlayerboardType(roomName)
    const liberalCount = Math.floor(size(playersDict) / 2) + 1
    const facistCount = size(playersDict) - liberalCount

    // selecting random facists and hitler
    const shuffledPlayers = map(shuffle(values(playersDict)), 'playerName')
    const hitlerPlayerName = shuffledPlayers[0]
    const selectedFacists = slice(shuffledPlayers, 1, facistCount)
    forEach(playersDict, player => player.affiliation = PlayerAffilications.LIBERAL_AFFILIATION)
    forEach(selectedFacists, (playerName) => {
        playersDict[playerName].affiliation = PlayerAffilications.FACIST_AFFILIATION
        playersDict[playerName].facistAvatar = random(21, 21)
    })
    playersDict[hitlerPlayerName].affiliation = PlayerAffilications.HITLER_AFFILIATION
    playersDict[hitlerPlayerName].facistAvatar = 50
    updateRoom(roomName, 'playersDict', playersDict)

    // creating policy cards
    const fascistCards = fill(Array(11), PolicyCards.FacistPolicy)
    const liberalCards = fill(Array(6), PolicyCards.LiberalPolicy)
    updateRoom(roomName, 'drawPile', shuffle([...fascistCards, ...liberalCards]))
}

export const getRoomsList = () => {
    return mapValues(getAllRooms(), (room, key) => ({
        roomId: key,
        roomName: key,
        maxPlayers: room.maxPlayers,
        playersCount: size(room.playersDict),
    }))
}

export const getRoomDetailsForLobby = (roomName) => {
    const room = getRoom(roomName)
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
    } = getRoom(roomName)
    return {
        maxPlayers,
        gamePhase,
        ownerName,
        boardType,
        trackerPosition: failedElectionsCount,
        playersDict: mapValues(playersDict, (player) => ({
            ...pick(player, ['playerName', 'avatarNumber']),
            affiliation: PlayerAffilications.LIBERAL_AFFILIATION,
        })),
    }
}

export const getRoomOwner = (roomName) => {
    const { playersDict, ownerName } = getRoom(roomName)
    return playersDict[ownerName]
}

export const findNewRoomOwner = (roomName) => {
    const { playersDict } = getRoom(roomName)
    const newOwner = sample(playersDict)
    updateRoom(roomName, 'ownerName', get(newOwner, 'playerName'))
    return newOwner
}

export const getPlayersCount = (roomName) => {
    const { playersDict } = getRoom(roomName)
    return size(playersDict)
}

export const removeRoom = (roomName) => {
    deleteRoom(roomName)
}

export const getPlayerboardType = (roomName) => {
    return getRoom(roomName).boardType
}

export const checkWinConditions = (roomName) => {
    const { playersDict } = getRoom(roomName)
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

export const checkIfGameShouldFinish = (roomName) => {
    const { winningSide } = checkWinConditions(roomName)
    return !!winningSide
}
