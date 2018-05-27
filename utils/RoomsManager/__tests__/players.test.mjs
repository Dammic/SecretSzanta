import { size } from 'lodash'
import { roomsStore } from '../../../stores'

import {
    addPlayer,
    removePlayer,
    getPlayerInfo,
    isRoomOwner,
    killPlayer,
    kickPlayer,
    isInBlackList,
    getOtherAlivePlayers,
} from '../players'
import { initializeRoom } from '../rooms'

// TODO: add missing tests
// addPlayer,
// removePlayer,
// getPlayerInfo,
// isRoomOwner,
// killPlayer,
// kickPlayer,
// getOtherAlivePlayers,

describe('players', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(roomsStore)).toEqual(1)
    })

    describe('isInBlackList', () => {
        test('if blacklist is empty, should return false', () => {
            const { testRoom } = roomsStore
            testRoom.blackList = []

            expect(isInBlackList('testRoom', 'ala')).toEqual(false)
        })

        test('if blacklist contains the user, should return true', () => {
            const { testRoom } = roomsStore
            testRoom.blackList = ['ala', 'ola']

            expect(isInBlackList('testRoom', 'ala')).toEqual(true)
        })

        test('if blacklist contains some users but not this one, should return false', () => {
            const { testRoom } = roomsStore
            testRoom.blackList = ['olga', 'ola']

            expect(isInBlackList('testRoom', 'ala')).toEqual(false)
        })
    })
})
