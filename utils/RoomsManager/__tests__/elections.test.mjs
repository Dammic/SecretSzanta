import { size } from 'lodash'
import { roomsStore } from '../../../stores'

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
        expect(size(roomsStore)).toEqual(1)
    })
    describe('increaseFailedElectionsCount ', () => {
        test('it increases the failed elections count', () => {
            const { testRoom } = roomsStore
            testRoom.failedElectionsCount = 0
            increaseFailedElectionsCount('testRoom')
            expect(testRoom.failedElectionsCount).toEqual(1)
        })
    })

    describe('getFailedElectionsCount', () => {
        test('it returns failed elections count', () => {
            const { testRoom } = roomsStore
            testRoom.failedElectionsCount = 3
            expect(getFailedElectionsCount('testRoom')).toEqual(3)
        })
    })

    describe('resetFailedElectionsCount', () => {
        test('it resets failed elections count', () => {
            const { testRoom } = roomsStore
            testRoom.failedElectionsCount = 3
            resetFailedElectionsCount('testRoom')
            expect(testRoom.failedElectionsCount).toEqual(0)
        })
    })
})
