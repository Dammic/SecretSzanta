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
                password
            }
        },
        deleteRoom: function (roomName) {
            if (isRoomPresent(roomName)) {
                rooms_props = _.filter(rooms_props, (room, key) => {
                    if (roomName === key) {
                        return true
                    }
                })
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
                if (slot.player) result.push(slot.player.playerName)
                return result
            }, [])
            return {
                maxPlayers: room.maxPlayers,
                playersCount: room.playersCount,
                slots: room.slots,
                playersList
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
                    playerName
                }
                rooms_props[roomName].playersCount += 1
            } else {
                //@TODO: RETURN A PROPER WARNING FOR THE USER (MODAL OR SOMETHING LIKE THAT)
                console.warn('player with the same name is already on this board!')
            }

            console.info(rooms_props[roomName])
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

            console.info(rooms_props[roomName])
        },

        getPlayerInfo: function (roomName, playerName) {
            const {slots} = rooms_props[roomName]
            return slots.find((slot) => (slot.player && slot.player.playerName === playerName))
        },

        /**
         * Function that checks if the room is defined or not
         * @param roomName - id of a room
         * @returns {Boolean} - true if created, false if not created
         */
        isRoomPresent: function (roomName) {
            return !!rooms_props[roomName]
        }
    }
}

module.exports = RoomsManager