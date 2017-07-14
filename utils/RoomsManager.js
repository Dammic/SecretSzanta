'use strict'
const { tail, countBy, mapValues, isNil, filter, includes, forEach, random, slice, get, times, map, find, pick, sortBy, size } = require('lodash');
const { GamePhases, PlayerRole, PlayerAffilications }  = require('../Dictionary')

/**
 * This function contains methods to manage rooms variables and rooms.
 * @returns {Object} - set of functions for maintaining rooms variables
 */
const RoomsManager = function() {
    let rooms_props = {}

    /**
     * Function initializing rooms handler. It initializes default variables for the room,
     *      as well as empty slots for players
     * @param {String} roomName - unique name of the modified room
     * @param {Number} [maxPlayers = 10] - max amount of players in the room
     */
    return {
        initializeRoom: (roomName, maxPlayers = 10, password) => {
            let freeSlots = []
            times(maxPlayers, index => freeSlots.push(index + 1))

            rooms_props[roomName] = {
                freeSlots,
                playersDict: [],
                maxPlayers,
                password,
                chancellorCandidateName: '',
                votes: [],
                gamePhase: GamePhases.GAME_PHASE_NEW,
            }
        },

        setChancellor: (roomName) => {
            const { playersDict, chancellorCandidateName } = rooms_props[roomName]

            const previousChancellor = find(playersDict, { role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR })
            if (previousChancellor) previousChancellor.role = null

            const currentChancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })
            if (currentChancellor) currentChancellor.role = PlayerRole.ROLE_PREVIOUS_CHANCELLOR

            const nextChancellor = playersDict[chancellorCandidateName]
            nextChancellor.role = PlayerRole.ROLE_CHANCELLOR
        },

        getChancellor: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            const chancellor = find(playersDict, { role: PlayerRole.ROLE_CHANCELLOR })

            return (chancellor ? pick(chancellor, ['playerName', 'avatarNumber']) : null)
        },

        getChancellorCandidateInfo: (roomName) => {
            const { playersDict, chancellorCandidateName } = rooms_props[roomName]
            const chancellorCandidate = playersDict[chancellorCandidateName]
            
            return (chancellorCandidate ? pick(chancellorCandidate, ['playerName', 'avatarNumber']) : null)
        },

        setPresident: (roomName, presidentName) => {
            const { playersDict } = rooms_props[roomName]

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
        },

        getPresident: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            const president = find(playersDict, { role: PlayerRole.ROLE_PRESIDENT })
            
            return (president ? pick(president, ['playerName', 'avatarNumber']) : null)
        },

        chooseNextPresident: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            const lastPresidentSlotNumber = get(find(playersDict, { role: PlayerRole.ROLE_PRESIDENT }), 'slotNumber')

            // if no president has been choosen, we choose the first player on the list
            const nextPresident = (lastPresidentSlotNumber 
                ? find(playersDict, { slotNumber: (lastPresidentSlotNumber + 1) % size(playersDict) })
                : find(playersDict, { slotNumber: 0 })
            )
            this.setPresident(roomName, nextPresident)
        },

        startGame: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            rooms_props[roomName].gamePhase = GamePhases.START_GAME;

            const liberalCount = Math.floor(size(playersDict) / 2) + 1
            const facistCount = size(playersDict) - liberalCount;

            // selecting random facists and hitler
            const shuffledPlayers = map(playersDict.sort(() => .5 - Math.random()), 'playerName')
            const hitlerPlayerName = shuffledPlayers[0]
            const selectedFacists = slice(shuffledPlayers, 1, facistCount - 1)
            forEach(selectedFacists, (playerName) => {
                playersDict[playerName].affiliation = PlayerAffilications.FACIST_AFFILIATION
                playersDict[playerName].facistAvatar = random(21, 21)
            })
            playersDict[hitlerPlayerName].affiliation = PlayerAffilications.HITLER_AFFILIATION
            playersDict[hitlerPlayerName].facistAvatar = 50
        },

        getFacists: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            const facistsDict = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
            return filter(
                pick(playersDict, ['playerName', 'affiliation', 'facistAvatar']),
                player => includes(facistsDict, player.affiliation)
            )
        },

        startChancellorChoicePhase: (roomName) => {
            rooms_props[roomName].gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            this.chooseNextPresident(roomName)
        },

        getChancellorChoices: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            const chancellorChoices = filter(
                pick(playersDict, ['playerName', 'avatarNumber', 'role']),
                player => isNil(player.role) 
            )
            return chancellorChoices
        },

        /***********Voting***********/

        initializeVoting: (roomName, chancellorCandidateName) => {
            const { playersDict } = rooms_props[roomName]
            rooms_props[roomName].votes = mapValues(playersDict, player => ({ playerName: player.playerName, didVote: false, value: null }))
            rooms_props[roomName].chancellorCandidateName = chancellorCandidateName
        },

        vote: (roomName, playerName, value) => {
            const { votes } = rooms_props[roomName]
            votes[playerName].didVote = true
            votes[playerName].value = value
        },

        didAllVote: (roomName) => {
            const { votes } = rooms_props[roomName]
            return !find(votes, { didVote: false })
        },

        getVotes: (roomName) => {
            return rooms_props[roomName].votes
        },

        getVotingResult: (roomName) => {
            const { votes } = rooms_props[roomName]
            const votesCount = countBy(votes, 'value')
            return ((votesCount[true] > votesCount[false]) || !votesCount[false])
        },

        /****************************/

        getRoomsList: () => {
            return map(rooms_props, (room, key) => ({
                roomName: key,
                maxPlayers: room.maxPlayers,
                playersCount: size(room.playersDict),
            }))
        },
        getRoomDetails: (roomName) => {
            const { playersDict, maxPlayers, gamePhase } = rooms_props[roomName]
            return {
                maxPlayers,
                gamePhase,
                playersDict: mapValues(playersDict, player => pick(player, ['playerName', 'avatarNumber'])),
                chancellorCandidate: this.getChancellorCandidateInfo(roomName),
            }
        },

        /**
         * Function that performs adding a new player to a room
         *      It checks if the player is already in the room or if there are no empty slots.
         * @param {String} roomName - unique name of the modified room
         * @param {String} playerName - name of the player to be added to the room
         * @param {Object} socket - Socket.IO socket object of the added player (for contacting with facists)
         */
        addPlayer: (roomName, playerName, socket) => {
            const { playersDict, freeSlots } = rooms_props[roomName]     
            const nextEmptySlot = freeSlots[0]

            if (!nextEmptySlot) {
                console.error("The rum is full!") 
            } else if (playersDict[playerName]) {
                console.error("The rum has player with the same name as you!")
            } else {
                const newPlayer = {
                    playerName,
                    role: null,
                    avatarNumber: _.random(1, 5),
                    facistAvatar: null,
                    affiliation: PlayerAffilications.LIBERAL_AFFILIATION,
                    slotNumber: nextEmptySlot, 
                    emit: socket.emit.bind(socket),
                }
                playersDict[playerName] = newPlayer
                rooms_props[roomName].freeSlots = tail(freeSlots)
            }
        },

        /**
         * Function that performs removing a player from a room
         * @param {String} roomName - unique name of the modified room
         * @param {String} playerName - name of the player to be removed from the room
         */
        removePlayer: (roomName, playerName) => {
            const { playersDict, freeSlots } = rooms_props[roomName]
            const player = playersDict[playerName] 
            
            if (player) {
                freeSlots.push(player.slotNumber) 
                delete playersDict[playerName]
            }
        },

        getPlayerInfo: (roomName, playerName) => {
            const { playersDict } = rooms_props[roomName]
            const player = playersDict[player]
 
            return (player
                ? pick(player, ['playerName', 'role', 'avatarNumber', 'slotNumber'])
                : null 
            )
        },

        /**
         * Function that checks if the room is defined or not
         * @param roomName - id of a room
         * @returns {Boolean} - true if created, false if not created
         */
        isRoomPresent: (roomName) => {
            return !isNil(rooms_props[roomName])
        },

        getPlayersCount: (roomName) => {
            const { playersDict } = rooms_props[roomName]
            return size(playersDict)
        }
    }
}

module.exports = RoomsManager
