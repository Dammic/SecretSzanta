import lodash from 'lodash'
import {
    GamePhases,
    PlayerRole,
    PlayerAffilications,
    PolicyCards,
    GlobalRoomName,
    PlayerBoards,
    ErrorTypes,
    WinReasons,
} from '../../Dictionary'
import { logInfo, logError } from '../../utils/utils'
import roomsStore from '../roomsStore'
import playersStore from '../playersStore'

const {
    reject, findIndex, sortBy, values, tail, countBy, mapValues, isNil, isEmpty,
    filter, includes, forEach, random, slice, times, map, head,
    find, pick, shuffle, size, sample, get, concat, fill, take, drop, pullAt, indexOf, dropRight,
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

export const isInBlackList = (roomName, playerName) => {
    const { blackList } = roomsStore[roomName]
    return includes(blackList, playerName)
}

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

export const getFacists = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const facistsDict = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
    return map(
        filter(playersDict, player => includes(facistsDict, player.affiliation)),
        player => pick(player, ['playerName', 'affiliation', 'facistAvatar', 'emit']),
    )
}
export const getLiberals = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    return filter(playersDict, { affiliation: PlayerAffilications.LIBERAL_AFFILIATION })
}
export const getHitler = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    return find(playersDict, { affiliation: PlayerAffilications.HITLER_AFFILIATION })
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

export const getChancellorChoices = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const chancellorChoices = []
    forEach(playersDict, (player) => {
        if (isNil(player.role) && !player.isDead) {
            chancellorChoices.push(player.playerName)
        }
    })
    return chancellorChoices
}

/***********Voting***********/

export const initializeVoting = (roomName, chancellorCandidateName) => {
    roomsStore[roomName].votes = {}
    roomsStore[roomName].chancellorCandidateName = chancellorCandidateName
}

export const vote = (roomName, playerName, value) => {
    const { playersDict, votes } = roomsStore[roomName]
    if (!playersDict[playerName].isDead) {
        votes[playerName] = value
    }
}

export const didAllVote = (roomName) => {
    const { votes, playersDict } = roomsStore[roomName]
    const votingPlayers = reject(playersDict, { isDead: true })
    return size(votes) === size(votingPlayers)
}

export const getRemainingVotesCount = (roomName) => {
    const { votes, playersDict } = roomsStore[roomName]
    const votingPlayers = reject(playersDict, { isDead: true })
    return size(votingPlayers) - size(votes)
}

export const getVotes = (roomName) => {
    return roomsStore[roomName].votes
}

export const getFailedElections = (roomName) => {
    return roomsStore[roomName].failedElectionsCount
}

export const getVotingResult = (roomName) => {
    const { votes } = roomsStore[roomName]
    const votesCount = countBy(votes)
    return ((votesCount[true] > votesCount[false]) || !votesCount[false])
}

export const increaseFailedElectionsCount = (roomName) => {
    const room = roomsStore[roomName]
    room.failedElectionsCount += 1
}
export const getFailedElectionsCount = (roomName) => {
    const { failedElectionsCount } = roomsStore[roomName]
    return failedElectionsCount
}
export const resetFailedElectionsCount = (roomName) => {
    roomsStore[roomName].failedElectionsCount = 0
}

/****************************/

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
export const getGamePhase = (roomName) => {
    return roomsStore[roomName].gamePhase
}

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
    const { playersDict, freeSlots, ownerName } = roomsStore[roomName]
    const player = playersDict[playerName]

    if (player) {
        freeSlots.unshift(player.slotNumber)
        delete playersDict[playerName]
    }
}

export const getPlayerInfo = (roomName, playerName) => {
    const { playersDict } = roomsStore[roomName]
    const player = playersDict[playerName]

    return (player
        ? pick(player, ['playerName', 'role', 'affiliation', 'avatarNumber', 'slotNumber'])
        : null
    )
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

export const isRoomOwner = (roomName, playerName) => {
    return playerName === roomsStore[roomName].ownerName
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

export const setGamePhase = (roomName, newPhase) => {
    roomsStore[roomName].gamePhase = newPhase
}

export const getRoleSocket = (roomName, role) => {
    const { playersDict } = roomsStore[roomName]
    return find(playersDict, { role }).emit
}

export const getOtherAlivePlayers = (roomName, currentPlayerName) => {
    const { playersDict } = roomsStore[roomName]
    const playersChoices = map(reject(playersDict, player => player.isDead || player.playerName === currentPlayerName), 'playerName')
    return playersChoices
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

/**********************************************/
/*******************policies*******************/
/**********************************************/
export const moveCard = (sourcePile, destinationPile, card) => {
    if (!includes(sourcePile, card)) {
        logError({}, `moveCard function: wanted to move card ${card} which don't exist in source pile`)
        return
    }
    pullAt(sourcePile, indexOf(sourcePile, card));
    destinationPile.push(card);
}

export const enactPolicy = (roomName, card) => {
    const { drawnCards, policiesPile } = roomsStore[roomName]
    moveCard( drawnCards, policiesPile, card)
    discardAllCards(roomName)
}
export const discardPolicy = (roomName, card) => {
    const { drawnCards, discardPile } = roomsStore[roomName]
    moveCard(drawnCards, discardPile, card)
}

export const discardAllCards = (roomName) => {
    const room = roomsStore[roomName]
    room.discardPile = [...room.discardPile, ...room.drawnCards]
    room.drawnCards = []
}

export const discardPolicyByVeto = (roomName) => {
    const { policiesPile, discardPile } = roomsStore[roomName]
    const discardedPolicy = take(policiesPile, 1)[0]
    moveCard(policiesPile, discardPile, discardedPolicy)
}

export const getDrawnCards = (roomName) => {
    return roomsStore[roomName].drawnCards
}

export const reShuffle = (roomName) => {
    const room = roomsStore[roomName]

    room.drawPile = shuffle(concat(room.drawPile, room.discardPile))
    room.discardPile = []
}

export const takeChoicePolicyCards = (roomName, amount) => {
    const room = roomsStore[roomName]

    if (size(room.drawPile) < amount) reShuffle(roomName)

    const policies = take(room.drawPile, amount)
    room.drawPile = drop(room.drawPile, amount)
    room.drawnCards = policies

    if (size(room.drawPile) < 3) reShuffle(roomName)
    return policies
}
export const peekPolicyCards = (roomName) => {
    const { drawPile } = roomsStore[roomName]
    return take(drawPile, 3)
}
export const getPolicyCardsCount = (roomName, policyType) => {
    const { policiesPile } = roomsStore[roomName]
    return size(filter(policiesPile, policy => policy === policyType))
}

export const removeRoom = (roomName) => {
    delete roomsStore[roomName]
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
export const getPlayerboardType = (roomName) => {
    return roomsStore[roomName].boardType
}

/**********************************************/
/*****************playersList******************/
/**********************************************/
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
export const setPresidentBackup = (roomName) => {
    const currentPresident = getPresident(roomName)
    roomsStore[roomName].previousPresidentNameBackup = currentPresident.playerName
}
export const resetPresidentBackup = (roomName) => {
    roomsStore[roomName].previousPresidentNameBackup = null
}

export const checkWinConditions = (roomName) => {
    const { playersDict } = roomsStore[roomName];
    const hitler = find(playersDict, (player => player.affiliation === PlayerAffilications.HITLER_AFFILIATION))
    const fascistPoliciesCount = getPolicyCardsCount(roomName, PolicyCards.FacistPolicy);
    const liberalPoliciesCount = getPolicyCardsCount(roomName, PolicyCards.LiberalPolicy);
    if (liberalPoliciesCount === 5) {
        return { winningSide: PlayerAffilications.LIBERAL_AFFILIATION, reason: WinReasons.fiveLiberalCards }
    } else if (hitler.isDead) {
        return { winningSide: PlayerAffilications.LIBERAL_AFFILIATION, reason: WinReasons.hitlerDead }
    } else if (fascistPoliciesCount === 6) {
        return { winningSide: PlayerAffilications.FACIST_AFFILIATION, reason: WinReasons.sixFascistCards }
    } else if (fascistPoliciesCount >= 4 && hitler.role === PlayerRole.ROLE_CHANCELLOR) {
        return { winningSide: PlayerAffilications.FACIST_AFFILIATION, reason: WinReasons.hitlerBecameChancellor }
    }
    return { winningSide: null, reason: null }; 
}
