import { size } from 'lodash'
import { getAllRooms, updateRoom, getRoom } from '../../../stores'

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
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        isDead: true,
                    },
                    ola: {
                        isDead: false,
                    },
                    ela: {
                        isDead: false,
                    },
                    umbrela: {
                        isDead: true,
                    },
                },
            })
            const { playersDict } = getRoom('testRoom')
            const expectedResult = [playersDict.ola, playersDict.ela]

            expect(getAlivePlayers('testRoom')).toEqual(expectedResult)
        })
        test('returns empty array if everyone is dead', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        isDead: true,
                    },
                    umbrela: {
                        isDead: true,
                    },
                },
            })
            const expectedResult = []

            expect(getAlivePlayers('testRoom')).toEqual(expectedResult)
        })
    })

    describe('getOtherAlivePlayerNames', () => {
        test('returns all other alive players', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        playerName: 'ala',
                        isDead: true,
                    },
                    ola: {
                        playerName: 'ola',
                        isDead: false,
                    },
                    ela: {
                        playerName: 'ela',
                        isDead: false,
                    },
                    umbrela: {
                        playerName: 'umbrela',
                        isDead: true,
                    },
                },
            })
            expect(getOtherAlivePlayerNames('testRoom', 'ola')).toEqual(['ela'])
            expect(getOtherAlivePlayerNames('testRoom', 'ela')).toEqual(['ola'])
        })
        test('returns empty array if everyone except for ela is dead', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        playerName: 'ala',
                        isDead: true,
                    },
                    ela: {
                        playerName: 'ela',
                        isDead: false,
                    },
                    umbrela: {
                        playerName: 'umbrela',
                        isDead: true,
                    },
                },
            })
            const expectedResult = []

            expect(getOtherAlivePlayerNames('testRoom', 'ela')).toEqual(expectedResult)
        })
    })
})
