import { roomsStore } from '../../stores'

export const getFailedElections = (roomName) => {
    return roomsStore[roomName].failedElectionsCount
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
