import { roomsStore } from '../../stores'

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
