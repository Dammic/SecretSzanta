import { size } from 'lodash'
import { getAllRooms, updateRoom } from '../../../stores'

import {
    addPlayer,
    removePlayer,
    getPlayerInfo,
    isRoomOwner,
    killPlayer,
    kickPlayer,
    isInBlackList,
    getAlivePlayers,
    getOtherAlivePlayerNames,
} from '../players'
import { initializeRoom } from '../rooms'

// TODO: add missing tests
// addPlayer,
// removePlayer,
// getPlayerInfo,
// isRoomOwner,
// killPlayer,
// kickPlayer,
// getOtherAlivePlayerNames,

describe('players', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })

    describe('isInBlackList', () => {
        test('if blacklist is empty, should return false', () => {
            updateRoom('testRoom', { blackList: [] })

            expect(isInBlackList('testRoom', 'ala')).toEqual(false)
        })

        test('if blacklist contains the user, should return true', () => {
            updateRoom('testRoom', { blackList: ['ala', 'ola'] })

            expect(isInBlackList('testRoom', 'ala')).toEqual(true)
        })

        test('if blacklist contains some users but not this one, should return false', () => {
            updateRoom('testRoom', { blackList: ['olga', 'ola'] })

            expect(isInBlackList('testRoom', 'ala')).toEqual(false)
        })
    })

    describe('getAlivePlayers', () => {
        test('returns alive players', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                isDead: true,
            }
            testRoom.playersDict.ola = {
                isDead: false,
            }
            testRoom.playersDict.ela = {
                isDead: false
            }
            testRoom.playersDict.umbrela = {
                isDead: true
            }
            const expectedResult = [ testRoom.playersDict.ola, testRoom.playersDict.ela ]

            expect(getAlivePlayers('testRoom')).toEqual(expectedResult)
        })
        test('returns empty array if everyone is dead', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                isDead: true,
            }
            testRoom.playersDict.umbrela = {
                isDead: true
            }
            const expectedResult =[ ]

            expect(getAlivePlayers('testRoom')).toEqual(expectedResult)
        })
    })

    describe('getOtherAlivePlayerNames', () => {
        test('returns all other alive players', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                playerName : 'ala',
                isDead: true,
            }
            testRoom.playersDict.ola = {
                playerName : 'ola',
                isDead: false,
            }
            testRoom.playersDict.ela = {
                playerName : 'ela',
                isDead: false
            }
            testRoom.playersDict.umbrela = {
                playerName : 'umbrela',
                isDead: true
            }
            //const expectedResult = [ testRoom.playersDict.ola, testRoom.playersDict.ela ]

            expect(getOtherAlivePlayerNames('testRoom', 'ola')).toEqual(['ela'])
            expect(getOtherAlivePlayerNames('testRoom', 'ela')).toEqual(['ola'])
        })
        test('returns empty array if everyone is dead', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                playerName : 'ala',
                isDead: true,
            }
            testRoom.playersDict.umbrela = {
                playerName : 'umbrela',
                isDead: true
            }
            testRoom.playersDict.ela = {
                playerName : 'ela',
                isDead: false
            }
            const expectedResult =[ ]

            expect(getOtherAlivePlayerNames('testRoom', 'ela')).toEqual(expectedResult)
        })
    })
})
