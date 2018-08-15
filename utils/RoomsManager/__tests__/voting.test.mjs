import { size } from 'lodash'
import { roomsStore } from '../../../stores'

import {
    initializeVoting,
    vote,
    didAllVote,
    getRemainingVotesCount,
    getRemainingVotingPlayers,
    getVotes,
    getVotingResult,
    getChancellorChoices,
} from '../voting'
import { initializeRoom } from '../rooms'

// TODO: MISSING TESTING FUNCTIONS
// initializeVoting,
// vote,
// getRemainingVotesCount,
// getVotes,
// getVotingResult,
// getChancellorChoices,

describe('voting', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(roomsStore)).toEqual(1)
    })
    describe('didAllVote', () => {
        test('all eligible voted (1 dead person)', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict = {
                ala: { isDead: false, playerName: 'ala' },
                ola: { isDead: true, playerName: 'ola' },
                ula: { isDead: false, playerName: 'ula' },
                iza: { isDead: false, playerName: 'iza' },
            }
            testRoom.votes = {
                ala: true,
                ula: false,
                iza: true,
            }
            const result = didAllVote('testRoom')
            expect(result).toEqual(true)
        })

        test('not all eligible voted', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict = {
                ala: { isDead: false, playerName: 'ala' },
                ula: { isDead: false, playerName: 'ula' },
                iza: { isDead: false, playerName: 'iza' },
            }
            testRoom.votes = {
                ala: true,
                iza: true,
            }
            const result = didAllVote('testRoom')
            expect(result).toEqual(false)
        })

        test('dead person voted, for some reason and should not take it into consideration', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict = {
                ala: { isDead: true, playerName: 'ala' },
                ula: { isDead: false, playerName: 'ula' },
                iza: { isDead: false, playerName: 'iza' },
            }
            testRoom.votes = {
                ala: true,
                ula: false,
            }
            const result = didAllVote('testRoom')
            expect(result).toEqual(false)
        })
    })

    describe('getRemainingVotingPlayers', () => {
        test('returns players that did not vote', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict = {
                ala: { isDead: true, playerName: 'ala' },
                ula: { isDead: false, playerName: 'ula' },
                iza: { isDead: false, playerName: 'iza' },
            }
            testRoom.votes = {
                ala: true,
                ula: false,
            }
            const result = getRemainingVotingPlayers('testRoom')
            expect(result).toEqual(['iza'])
        })

        test('returns players that did not vote #2', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict = {
                ala: { isDead: true, playerName: 'ala' },
                ula: { isDead: false, playerName: 'ula' },
                iza: { isDead: false, playerName: 'iza' },
            }
            testRoom.votes = {}
            const result = getRemainingVotingPlayers('testRoom')
            expect(result).toEqual(['ala', 'ula', 'iza'])
        })
    })
})
