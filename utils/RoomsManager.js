'use strict'

/**
 * This function contains methods to manage rooms variables and rooms.
 * @returns {Object} - set of functions for maintaining rooms variables
 */
const RoomsManager = function() {
    const rooms_props = {}

    const initializeRoom = function(roomName, maxPlayers) {
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
            playersCount: 0
        }
    }

    const addPlayer = function(roomName, playerName) {
        const {slots} = rooms_props[roomName]

        // check if there is any free slot, returns first one or undefined if none found
        const nextEmptySlot = slots.find((slot) => !(slot.player))

        // check if the player is already on the server, returns object or undefined if no player has the same name
        const samePlayerObject = slots.find((slot) => (slot.player && slot.player.playerName === playerName) )

        if(!samePlayerObject && nextEmptySlot) {
            nextEmptySlot.player = {
                playerName
            }
        } else {
            //@TODO: RETURN A PROPER WARNING FOR THE USER (MODAL OR SOMETHING LIKE THAT)
            console.warn('player with the same name is already on this board!')
        }

        console.info(slots)
    }

    const removePlayer = function(roomName, playerName) {
        const {slots} = rooms_props[roomName]
        const playerObject = slots.find((slot) => (slot.player && slot.player.playerName === playerName) )
        playerObject.player = null

        console.info(slots)
    }

    /**
     * Function that sets a variable for a room
     * @param roomName - id of a room
     * @param key - key of the variable we would like to add
     * @param value - value of the variable we would like to add
     */
    const setRoomProperty = function (roomName, key, value) {
        rooms_props[roomName] = rooms_props[roomName] || {}
        rooms_props[roomName][key] = value
    }

    /**
     * Function that deletes a variable in a room (sets it to null)
     * @param roomName - id of a room
     * @param key - key of the variable we would like to delete
     */
    const deleteRoomProperty = function (roomName, key) {
        rooms_props[roomName][key] = null
    }

    /**
     * Function that returns a specific room's variables
     * @param roomName - id of a room
     * @returns {Object} - an object containing all variables for a room
     */
    const getRoomProperties = function (roomName) {
        return rooms_props[roomName]
    }

    /**
     * Function that returns all rooms
     * @returns {Object} - an object containing all rooms as keys
     */
    const getRooms = function () {
        return rooms
    }

    /**
     * Function that returns all users in a room
     * @param roomName - id of a room
     * @returns {Object} - an object with all users in a room as keys
     */
    // const getUsersInRoom = function (roomName) {
    //     return rooms_props[roomName].slots
    // }

    /**
     * Function that deletes a room variables and room data if a room is empty
     * @param roomName - id of a room
     */
    const deleteEmptyRoom = function (roomName) {
        if (!rooms[roomName][roomName]) {
            rooms[roomName] = null
            rooms_props[roomName] = null
        }
    }

    /**
     * Function that checks if the room is defined or not
     * @param roomName - id of a room
     * @returns {Boolean} - true if created, false if not created
     */
    const isRoomAlreadyCreated = function (roomName) {
        return rooms_props[roomName]
    }

    return {
        setRoomProperty,
        deleteRoomProperty,
        getRoomProperties,
        getRooms,
        addPlayer,
        removePlayer,
        initializeRoom,
        // getUsersInRoom,
        deleteEmptyRoom,
        isRoomAlreadyCreated
    }
}

module.exports = RoomsManager