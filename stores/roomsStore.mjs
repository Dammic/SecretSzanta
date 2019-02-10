import lodash from 'lodash'

const { set, cloneDeep } = lodash

const roomsStore = {

}

export const getRoom = (roomName) => {
    if (!roomsStore[roomName]) {
        // throw new Error("")
        console.error('get error')
    }

    return cloneDeep(roomsStore[roomName])
}

export const deleteRoom = (roomName) => {
    delete roomsStore[roomName]
}

export const getAllRooms = (roomName) => {
    if (!roomsStore[roomName]) {
        // throw new Error("")
        console.error('get error')
    }

    return cloneDeep(roomsStore)
}

export const updateRoom = (roomName, path, value) => {
    if (!roomsStore[roomName]) {
        console.error('update error')
    }

    set(roomsStore[roomName], path, value)
}
