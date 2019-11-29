import { size } from 'lodash'
import { getAllRooms, getRoom, updateRoom } from '../../../stores'

import {
    increaseFailedElectionsCount,
    getFailedElectionsCount,
    resetFailedElectionsCount,
} from '../elections'
import { initializeRoom } from '../rooms'

describe('elections', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })
    describe('increaseFailedElectionsCount ', () => {
        test('it increases the failed elections count', () => {
            updateRoom('testRoom', { failedElectionsCount: 0 })
            increaseFailedElectionsCount('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom.failedElectionsCount).toEqual(1)
        })
    })

    describe('getFailedElectionsCount', () => {
        test('it returns failed elections count', () => {
            updateRoom('testRoom', { failedElectionsCount: 3 })

            expect(getFailedElectionsCount('testRoom')).toEqual(3)
        })
    })

    describe('resetFailedElectionsCount', () => {
        test('it resets failed elections count', () => {
            updateRoom('testRoom', { failedElectionsCount: 3 })
            resetFailedElectionsCount('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom.failedElectionsCount).toEqual(0)
        })
    })
})
