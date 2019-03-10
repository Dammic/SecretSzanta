import lodash from 'lodash'

const { cloneDeep, isNil, mergeWith, isArray, isPlainObject, isEmpty } = lodash

const customMerge = (_, srcValue) => {
    if (isArray(srcValue) || (isPlainObject(srcValue) && isEmpty(srcValue))) {
        return srcValue
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
