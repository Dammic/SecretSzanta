import { getRoom, updateRoom } from '../../stores'

export const increaseFailedElectionsCount = (roomName) => {
    const { failedElectionsCount } = getRoom(roomName)
    updateRoom(roomName, 'failedElectionsCount', failedElectionsCount + 1)
}
export const getFailedElectionsCount = (roomName) => {
    return getRoom(roomName).failedElectionsCount
}
export const resetFailedElectionsCount = (roomName) => {
    updateRoom(roomName, 'failedElectionsCount', 0)
}
