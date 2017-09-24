const {
    reject, findIndex, sortBy, values, tail, countBy, mapValues, isNil,
    filter, includes, forEach, random, slice, times, map,
    find, pick, shuffle, size,
} = require('lodash')
const { GamePhases, PlayerRole, PlayerAffilications } = require('../Dictionary')

/**
 * This function contains methods to manage rooms variables and rooms.
 * @returns {Object} - set of functions for maintaining rooms variables
 */
class RoomsManager {
    constructor() {
        this.rooms_props = {}
    }

    /**
     * Function initializing rooms handler. It initializes default variables for the room,
     *      as well as empty slots for players
     * @param {String} roomName - unique name of the modified room
     * @param {Number} [maxPlayers = 10] - max amount of players in the room
     */
    initializeRoom(roomName, maxPlayers = 10, password) {
        let freeSlots = []
        times(maxPlayers, index => freeSlots.push(index + 1))

        this.rooms_props[roomName] = {
            freeSlots,
            playersDict: {},
            maxPlayers,
            password,
            chancellorCandidateName: '',
            votes: {},
            gamePhase: GamePhases.GAME_PHASE_NEW,
        }
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
        const nextChancellor = playersDict[chancellorCandidateName]
        nextChancellor.role = PlayerRole.ROLE_CHANCELLOR
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
        let nextPresidentIndex = 0
        if (lastPresidentIndex >= 0 && lastPresidentIndex < size(sortedPlayers) - 1) {
            nextPresidentIndex = lastPresidentIndex + 1
        }

        const nextPresident = sortedPlayers[nextPresidentIndex]
        this.setPresident(roomName, nextPresident.playerName)
    }

    startGame(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        this.rooms_props[roomName].gamePhase = GamePhases.START_GAME

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

    getVotingResult(roomName) {
        const { votes } = this.rooms_props[roomName]
        const votesCount = countBy(votes)
        return ((votesCount[true] > votesCount[false]) || !votesCount[false])
    }

    /****************************/

    getRoomsList() {
        return map(this.rooms_props, (room, key) => ({
            roomName: key,
            maxPlayers: room.maxPlayers,
            playersCount: size(room.playersDict),
        }))
    }
    getRoomDetails(roomName) {
        const { playersDict, maxPlayers, gamePhase } = this.rooms_props[roomName]
        return {
            maxPlayers,
            gamePhase,
            playersDict: mapValues(playersDict, player => pick(player, ['playerName', 'avatarNumber'])),
        }
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
                avatarNumber: random(1, 5),
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
        const { playersDict, freeSlots } = this.rooms_props[roomName]
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
            ? pick(player, ['playerName', 'role', 'avatarNumber', 'slotNumber'])
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

    getPlayersCount(roomName) {
        const { playersDict } = this.rooms_props[roomName]
        return size(playersDict)
    }
    
    setGamePhase(roomName, newPhase) {
        this.rooms_props[roomName].gamePhase = newPhase
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
}

module.exports = RoomsManager
