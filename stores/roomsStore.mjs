import lodash from 'lodash'

const { set, cloneDeep, isNil, mergeWith, isArray } = lodash

const customMerge = (objValue, srcValue) => {
    if (isArray(objValue)) {
        return objValue
    }
}

const roomsStore = {

}

const assertRoomExistence = (roomName) => {
    if (!roomsStore[roomName]) {
        throw new Error('Client tried to access a room that does not exist!')
    }
}

export const getRoom = (roomName) => {
    assertRoomExistence(roomName)

    return cloneDeep(roomsStore[roomName])
}

export const deleteRoom = (roomName) => {
    delete roomsStore[roomName]
}

export const createRoom = (roomName, roomData) => {
    roomsStore[roomName] = cloneDeep(roomData)
}

export const getAllRooms = () => {
    return cloneDeep(roomsStore)
}

export const updateRoom = (roomName, changeObject) => {
    assertRoomExistence(roomName)
    mergeWith(roomsStore[roomName], changeObject, customMerge)
}

export const isRoomPresent = (roomName) => {
    return !isNil(roomsStore[roomName])
}

//TODO: change this solution to proxy!
