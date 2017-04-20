'use strict'
const _ = require('lodash')

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
        initializeRoom: function (roomName, maxPlayers = 10, password) {
            let slots = []
            const tmp = [...Array(maxPlayers)].map((value, index) => {
                slots[index] = {
                    slotID: index + 1,
                    player: null
                }
            })

            rooms_props[roomName] = {
                slots,
                maxPlayers,
                playersCount: 0,
                password,
                chancellorCandidateName: '',
                votes: [],
                gamePhase: 'GAME_PHASE_NEW'
            }
        },

        setChancellor: function(roomName) {
            let {slots, chancellorCandidateName} = rooms_props[roomName]

            const previousChancellor = _.find(slots, (slot) => slot.player && slot.player.role === 'ROLE_PREVIOUS_CHANCELLOR')
            if(previousChancellor) previousChancellor.player.role = null

            const currentChancellor = _.find(slots, (slot) => slot.player && slot.player.role === 'ROLE_CHANCELLOR')
            if(currentChancellor) currentChancellor.player.role = 'ROLE_PREVIOUS_CHANCELLOR'

            const nextChancellor = _.find(slots, (slot) => slot.player && slot.player.playerName === chancellorCandidateName)
            nextChancellor.player.role = 'ROLE_CHANCELLOR'
        },

        getChancellor: function(roomName) {
            let {slots} = rooms_props[roomName]
            const {playerName, avatarNumber} = _.find(slots, (slot) => slot.player && slot.player.role === 'ROLE_CHANCELLOR')
            return {playerName: playerName, avatarNumber: avatarNumber}
        },

        getChancellorCandidateInfo: function(roomName, chancellorCandidateName) {
            let {slots} = rooms_props[roomName]
            const chancellorCandidate = _.find(slots, (slot) => slot.player && slot.player.playerName === chancellorCandidateName);
            return ( chancellorCandidate ? {playerName: chancellorCandidate.playerName, avatarNumber: chancellorCandidate.avatarNumber} : null )
        },

        setPresident: function(roomName, presidentName) {
            let {slots} = rooms_props[roomName]
            rooms_props[roomName].president = presidentName

            const previousPresident = _.find(slots, (slot) => slot.player && slot.player.role === 'ROLE_PREVIOUS_PRESIDENT')
            if(previousPresident) previousPresident.player.role = null

            const currentPresident = _.find(slots, (slot) => slot.player && slot.player.role === 'ROLE_PRESIDENT')
            if(currentPresident) currentPresident.player.role = 'ROLE_PREVIOUS_PRESIDENT'

            const nextPresident = _.find(slots, (slot) => slot.player && slot.player.playerName === presidentName)
            nextPresident.player.role = 'ROLE_PRESIDENT'
        },

        getPresident: function(roomName) {
            let {slots} = rooms_props[roomName]
            const president = _.find(slots, (slot) => slot.player && slot.player.role === 'ROLE_PRESIDENT')
            return ( president ? {playerName: president.playerName, avatarNumber: president.avatarNumber} : null )
        },

        chooseNextPresident: function(roomName) {
            const playersList = _.reduce(rooms_props[roomName].slots, function(result, slot) {
                if(slot.player) result.push(slot.player.playerName)
                return result;
            }, [])
            const indexOfLastPresident = _.findIndex(playersList, (player) => player === this.getPresident(roomName))
            // if no president has been choosen, we choose the first player on the list
            const nextPresidentName = ( indexOfLastPresident >= 0 ? playersList[(indexOfLastPresident + 1) % playersList.length] : playersList[0])
            this.setPresident(roomName, nextPresidentName)
        },

        startGame: function(roomName) {
            rooms_props[roomName].gamePhase = 'STARTED';

            // filtering unnecessary empty slots
            //rooms_props[roomName].slots = _.filter(rooms_props[roomName].slots, (slot) => slot.player)

            const playersList = _.reduce(rooms_props[roomName].slots, (result, slot) => {
                if (slot.player) result.push(slot.player.playerName)
                return result
            }, [])
        },

        startChancellorChoicePhase: function(roomName) {
            rooms_props[roomName].gamePhase = 'GAME_PHASE_CHANCELLOR_CHOICE'
            this.chooseNextPresident(roomName)
        },

        getChancellorChoices: function(roomName) {
            const chancellorChoices = _.reduce(rooms_props[roomName].slots, function(result, slot) {
                if(slot.player && slot.player.role === null) result.push({playerName: slot.player.playerName, avatarNumber: slot.player.avatarNumber})
                return result;
            }, [])
            return chancellorChoices
        },

        /***********Voting***********/


        initializeVoting: function(roomName, chancellorCandidateName) {
            rooms_props[roomName].votes = _.reduce(rooms_props[roomName].slots, (result, slot) => {
                if(slot.player)  result.push({playerName: slot.player.playerName, didVote: false, value: null})
                return result;
            }, []);
            rooms_props[roomName].chancellorCandidateName = chancellorCandidateName
        },

        vote: function(roomName, playerName, value) {
            let playerVote = _.find(rooms_props[roomName].votes, (vote) => vote.playerName === playerName);
            playerVote.didVote = true;
            playerVote.value = value;
        },

        didAllVote: function(roomName) {
            return (_.find(rooms_props[roomName].votes, (vote) => vote.didVote === false) ? false : true)
        },

        getVotes: function(roomName) {
            return rooms_props[roomName].votes;
        },

        getVotingResult: function(roomName) {
            const votesCount = _.countBy(rooms_props[roomName].votes, 'value');
            return votesCount[true] > votesCount[false] || !votesCount[false]
        },

        /****************************/


        deleteRoom: function (roomName) {
            if (isRoomPresent(roomName)) {
                rooms_props = _.filter(rooms_props, (room, key) => (roomName !== key) ? true : false)
            }
        },
        getRoomsList: function () {
            return _.reduce(rooms_props, (result, room, key) => {
                result.push({
                    roomName: key,
                    maxPlayers: room.maxPlayers,
                    playersCount: room.playersCount
                })
            }, [])
        },
        getRoomDetails: function (roomName) {
            const room = rooms_props[roomName]
            const playersList = _.reduce(room.slots, (result, slot) => {
                if (slot.player) result.push({playerName: slot.player.playerName, avatarNumber: slot.player.avatarNumber})
                return result
            }, [])
            return {
                maxPlayers: room.maxPlayers,
                playersCount: room.playersCount,
                slots: room.slots,
                playersList,
                gamePhase: room.gamePhase,
                chancellorCandidate: this.getChancellorCandidateInfo(roomName, room.chancellorCandidateName)
            }
        },

        /**
         * Function that performs adding a new player to a room, increasing the player count by one.
         *      It checks if the player is already in the room or if there are no empty slots.
         * @param {String} roomName - unique name of the modified room
         * @param {String} playerName - name of the player to be added to the room
         */
        addPlayer: function (roomName, playerName) {
            const {slots} = rooms_props[roomName]

            // check if there is any free slot, returns first one or undefined if none found
            const nextEmptySlot = slots.find((slot) => !(slot.player))

            // check if the player is already on the server, returns object or undefined if no player has the same name
            let samePlayerObject = slots.find((slot) => (slot.player && slot.player.playerName === playerName))

            if (!samePlayerObject && nextEmptySlot) {
                nextEmptySlot.player = {
                    playerName,
                    role: null,
                    avatarNumber: _.random(1, 5)
                }
                rooms_props[roomName].playersCount += 1
            } else {
                //@TODO: RETURN A PROPER WARNING FOR THE USER (MODAL OR SOMETHING LIKE THAT)
                console.warn('player with the same name is already on this board!')
            }
        },

        /**
         * Function that performs removing a player from a room, decreasing the player count by one.
         * @param {String} roomName - unique name of the modified room
         * @param {String} playerName - name of the player to be removed from the room
         */
        removePlayer: function (roomName, playerName) {
            const {slots} = rooms_props[roomName]
            const playerObject = slots.find((slot) => (slot.player && slot.player.playerName === playerName))
            if (playerObject) {
                playerObject.player = null
                rooms_props[roomName].playersCount -= 1
            }
        },

        getPlayerInfo: function (roomName, playerName) {
            const {slots} = rooms_props[roomName]
            const playerInfo = slots.find((slot) => (slot.player && slot.player.playerName === playerName))
            return {
                playerName: playerInfo.player.playerName,
                role: playerInfo.player.role,
                avatarNumber: playerInfo.player.avatarNumber,
                slotID: playerInfo.slotID
            }
        },

        /**
         * Function that checks if the room is defined or not
         * @param roomName - id of a room
         * @returns {Boolean} - true if created, false if not created
         */
        isRoomPresent: function (roomName) {
            return (rooms_props[roomName] ? true : false)
        }
    }
}

module.exports = RoomsManager