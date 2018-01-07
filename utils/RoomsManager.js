const {
    reject, findIndex, sortBy, values, tail, countBy, mapValues, isNil, isEmpty,
    filter, includes, forEach, random, slice, times, map, head,
    find, pick, shuffle, size, sample, get, concat, fill, take, drop, pullAt, indexOf, dropRight,
} = require('lodash')
const {
    GamePhases,
    PlayerRole,
    PlayerAffilications,
    PolicyCards,
    GlobalRoomName,
    PlayerBoards,
} = require('../Dictionary')

/**
 * This function contains methods to manage rooms variables and rooms.
 * @returns {Object} - set of functions for maintaining rooms variables
 */
class RoomsManager {
    constructor() {
        this.players = {}
        this.rooms_props = {}
    }

    /**
     * Function initializing rooms handler. It initializes default variables for the room,
     *      as well as empty slots for players
     * @param {String} roomName - unique name of the modified room
     * @param {Number} [maxPlayers = 10] - max amount of players in the room
     */
    initializeRoom(roomName, ownerName, maxPlayers = 10, password) {
        let freeSlots = []
        times(maxPlayers, index => freeSlots.push(index + 1))
        console.log(`INFO - New room "${roomName}" was created by: ${ownerName}`)

        this.rooms_props[roomName] = {
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
        }
    }

    isInBlackList(roomName, playerName) {
        const { blackList } = this.rooms_props[roomName]
        return includes(blackList, playerName)
    }

    toggleVeto(roomName) {
        this.rooms_props[roomName].isVetoUnlocked = true
    }
    addVetoVote(roomName, playerName) {
        const { vetoVotes } = this.rooms_props[roomName]
        const playerRole = this.getPlayerRole(roomName, playerName)
        if (
            includes([PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT], playerRole)
            && !includes(vetoVotes, playerRole)
        ) {
            vetoVotes.push(playerRole)
        }
    }
    didVetoSucceed(roomName) {
        const { vetoVotes } = this.rooms_props[roomName]
        return size(vetoVotes) === 2
    }
    getVetoVotes(roomName) {
        return this.rooms_props[roomName].vetoVotes
    }
    clearVetoVotes(roomName) {
        this.rooms_props[roomName].vetoVotes = []
    }

    isVetoUnlocked(roomName) {
        return this.rooms_props[roomName].isVetoUnlocked
    }

    getPlayerRole(roomName, playerName) {
        const { playersDict } = this.rooms_props[roomName]
        return get(playersDict, `${playerName}.role`)
    }

    setChancellor(roomName) {
        const { playersDict, chancellorCandidateName } = this.rooms_props[roomName]

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

    getChancellor(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const chancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })

        return (chancellor ? pick(chancellor, ['playerName', 'avatarNumber']) : null)
    }

    getChancellorCandidateInfo(roomName) {
        const { playersDict, chancellorCandidateName } = this.rooms_props[roomName]
        const chancellorCandidate = playersDict[chancellorCandidateName]
       
        return (chancellorCandidate ? pick(chancellorCandidate, ['playerName', 'avatarNumber']) : null)
    }

    setPresident(roomName, presidentName) {
        const { playersDict } = this.rooms_props[roomName]

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

    getPresident(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const president = find(playersDict, { role: PlayerRole.ROLE_PRESIDENT })

        return (president ? pick(president, ['playerName', 'avatarNumber']) : null)
    }

    chooseNextPresident(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const sortedPlayers = sortBy(reject(playersDict, { isDead: true }), 'slotNumber')
        const lastPresidentIndex = findIndex(sortedPlayers, { role: PlayerRole.ROLE_PRESIDENT })
        const nextPresidentIndex = (lastPresidentIndex + 1) % size(sortedPlayers) 

        const nextPresident = sortedPlayers[nextPresidentIndex]
        this.setPresident(roomName, nextPresident.playerName)
    }

    startGame(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        this.rooms_props[roomName].gamePhase = GamePhases.START_GAME
        this.rooms_props[roomName].failedElectionsCount = 0
        this.setPlayerboardType(roomName)
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
        this.rooms_props[roomName] = {
            ...this.rooms_props[roomName],
            drawPile: shuffle(concat(fascistCards, liberalCards)),
            drawnCards: [],
            discardPile: [],
            policiesPile: [],
        }
    }
    
    getFacists(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const facistsDict = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
        return map(
            filter(playersDict, player => includes(facistsDict, player.affiliation)),
            player => pick(player, ['playerName', 'affiliation', 'facistAvatar', 'emit']),
        )
    }
    getLiberals(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        return filter(playersDict, { affiliation: PlayerAffilications.LIBERAL_AFFILIATION })
    }
    getHitler(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        return find(playersDict, { affiliation: PlayerAffilications.HITLER_AFFILIATION })
    }

    startChancellorChoicePhase(roomName) {
        this.rooms_props[roomName].gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
        this.chooseNextPresident(roomName)
    }

    getChancellorChoices(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const chancellorChoices = []
        forEach(playersDict, (player) => {
            if (isNil(player.role) && !player.isDead) {
                chancellorChoices.push(player.playerName)
            }
        })
        return chancellorChoices
    }

    /***********Voting***********/

    initializeVoting(roomName, chancellorCandidateName) {
        this.rooms_props[roomName].votes = {}
        this.rooms_props[roomName].chancellorCandidateName = chancellorCandidateName
    }

    vote(roomName, playerName, value) {
        const { playersDict, votes } = this.rooms_props[roomName]
        if (!playersDict[playerName].isDead) {
            votes[playerName] = value
        }
    }

    didAllVote(roomName) {
        const { votes, playersDict } = this.rooms_props[roomName]
        const votingPlayers = reject(playersDict, { isDead: true })
        return size(votes) === size(votingPlayers)
    }

    getRemainingVotesCount(roomName) {
        const { votes, playersDict } = this.rooms_props[roomName]
        const votingPlayers = reject(playersDict, { isDead: true })
        return size(votingPlayers) - size(votes)
    }

    getVotes(roomName) {
        return this.rooms_props[roomName].votes
    }

    getFailedElections(roomName) {
        return this.rooms_props[roomName].failedElectionsCount
    }

    getVotingResult(roomName) {
        const { votes } = this.rooms_props[roomName]
        const votesCount = countBy(votes)
        return ((votesCount[true] > votesCount[false]) || !votesCount[false])
    }

    increaseFailedElectionsCount(roomName) {
        const room = this.rooms_props[roomName]
        room.failedElectionsCount += 1
    }
    getFailedElectionsCount(roomName) {
        const { failedElectionsCount } = this.rooms_props[roomName]
        return failedElectionsCount 
    }
    resetFailedElectionsCount(roomName) {
        this.rooms_props[roomName].failedElectionsCount = 0
    }

    /****************************/

    getRoomsList() {
        return mapValues(this.rooms_props, (room, key) => ({
            roomName: key,
            maxPlayers: room.maxPlayers,
            playersCount: size(room.playersDict),
        }))
    }
    getRoomDetailsForLobby(roomName) {
        const room = this.rooms_props[roomName]
        if (!room) return null
        return {
            roomName,
            maxPlayers: room.maxPlayers,
            playersCount: size(room.playersDict),
        }
    }
    getRoomDetails(roomName) {
        const {
            playersDict,
            ownerName,
            maxPlayers,
            gamePhase,
            failedElectionsCount,
            boardType,
        } = this.rooms_props[roomName]
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
    getGamePhase(roomName) {
        return this.rooms_props[roomName].gamePhase
    }

    /**
     * Function that performs adding a new player to a room
     *      It checks if the player is already in the room or if there are no empty slots.
     * @param {String} roomName - unique name of the modified room
     * @param {String} playerName - name of the player to be added to the room
     * @param {Object} socket - Socket.IO socket object of the added player (for contacting with facists)
     */
    addPlayer(roomName, playerName, socket) {
        const { playersDict, freeSlots } = this.rooms_props[roomName]     
        const nextEmptySlot = freeSlots[0]

        if (!nextEmptySlot) {
            console.error("The rum is full!") 
        } else if (playersDict[playerName]) {
            console.error("The rum has player with the same name as you!")
        } else {
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
            this.rooms_props[roomName].freeSlots = tail(freeSlots)
        }
    }

    /**
     * Function that performs removing a player from a room
     * @param {String} roomName - unique name of the modified room
     * @param {String} playerName - name of the player to be removed from the room
     */
    removePlayer(roomName, playerName) {
        const { playersDict, freeSlots, ownerName } = this.rooms_props[roomName]
        const player = playersDict[playerName] 
        
        if (player) {
            freeSlots.unshift(player.slotNumber)
            delete playersDict[playerName]
        }
    }

    getPlayerInfo(roomName, playerName) {
        const { playersDict } = this.rooms_props[roomName]
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
    isRoomPresent(roomName) {
        return !isNil(this.rooms_props[roomName])
    }

    getRoomOwner(roomName) {
        const { playersDict, ownerName } = this.rooms_props[roomName]
        return playersDict[ownerName]
    }

    isRoomOwner(roomName, playerName) {
        return playerName === this.rooms_props[roomName].ownerName
    }

    findNewRoomOwner(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const newOwner = sample(playersDict)
        this.rooms_props[roomName].ownerName = get(newOwner, 'playerName')
        return newOwner
    }

    getPlayersCount(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        return size(playersDict)
    }
    
    setGamePhase(roomName, newPhase) {
        this.rooms_props[roomName].gamePhase = newPhase
    }

    getRoleSocket(roomName, role) {
        const { playersDict } = this.rooms_props[roomName]
        return find(playersDict, { role }).emit
    }

    getOtherAlivePlayers(roomName, currentPlayerName) {
        const { playersDict } = this.rooms_props[roomName]
        const playersChoices = map(reject(playersDict, player => player.isDead || player.playerName === currentPlayerName), 'playerName')
        return playersChoices
    }

    killPlayer(roomName, playerName) {
        const { playersDict } = this.rooms_props[roomName]

        const player = find(playersDict, { playerName })
        if (player) {
            player.isDead = true
        }
    }
    kickPlayer(roomName, playerName, banned) {
        const { playersDict, blackList } = this.rooms_props[roomName]

        if (banned) {
            blackList.push(playerName)
        }

        this.setGamePhase(roomName, GamePhases.Paused) 
        delete playersDict[playerName]
    }
    
    /**********************************************/
    /*******************policies*******************/
    /**********************************************/

    enactPolicy(roomName, card) {
        this.rooms_props[roomName].policiesPile.push(card)
        this.rooms_props[roomName].drawnCards = []
    }
    discardPolicy(roomName, card) {
        const { drawnCards } = this.rooms_props[roomName]
        pullAt(drawnCards, indexOf(drawnCards, card))
        this.rooms_props[roomName].discardPile.push(card)
    }

    discardAllCards(roomName) {
        const room = this.rooms_props[roomName]
        room.discardPile = [...room.discardPile, ...room.drawnCards]
        room.drawnCards = []
    }

    discardPolicyByVeto(roomName) {
        const { policiesPile, discardPile } = this.rooms_props[roomName]
        const discardedPolicy = take(policiesPile, 1)[0]
        this.rooms_props[roomName].policiesPile = dropRight(policiesPile, 1)
        discardPile.push(discardedPolicy)
    }

    getDrawnCards(roomName) {
        return this.rooms_props[roomName].drawnCards
    }
    takeChoicePolicyCards(roomName, amount) {
        const { drawPile, discardPile } = this.rooms_props[roomName]

        let tmpDrawPile = drawPile
        if (size(drawPile) < amount) {
            tmpDrawPile = shuffle(concat(drawPile, discardPile))
            this.rooms_props[roomName].discardPile = []
        }
        const policies = take(tmpDrawPile, amount)
        this.rooms_props[roomName].drawPile = drop(tmpDrawPile, amount)
        this.rooms_props[roomName].drawnCards = policies
        return policies
    }
    getPolicyCardsCount(roomName, policyType) {
        const { policiesPile } = this.rooms_props[roomName]
        return size(filter(policiesPile, policy => policy === policyType))
    }

    removeRoom(roomName) {
        delete this.rooms_props[roomName]
    }

    setPlayerboardType(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        const playersCount = size(playersDict)
        let boardType
        if (playersCount <= 6) {
            boardType = PlayerBoards.SmallBoard
        } else if (playersCount <= 8) {
            boardType = PlayerBoards.MediumBoard
        } else if (playersCount <= 10) {
            boardType = PlayerBoards.LargeBoard
        }
        this.rooms_props[roomName].boardType = boardType
    }
    getPlayerboardType(roomName) {
        return this.rooms_props[roomName].boardType
    }

    /**********************************************/
    /*****************playersList******************/
    /**********************************************/
    getPlayersList() {
        return this.players;
    }

    getPlayerFromPlayersList(userName) {
        return this.players[userName];
    }

    isInPlayersList(userName) {
        return !!this.players[userName]
    }

    addPlayerToPlayersList(userName) {
        this.players[userName] = {
            avatarNumber: random(1, 6),
            playerName: userName,
            currentRoom: null,
        }
    }
    removePlayerFromPlayersList(userName) {
        if (userName) {
            delete this.players[userName]
        }
    }
    updatePlayerRoom(userName, newRoomName) {
        this.players[userName].currentRoom = (newRoomName === GlobalRoomName ? '' : newRoomName)
    }
}

module.exports = RoomsManager
