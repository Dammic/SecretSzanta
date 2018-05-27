import lodash from 'lodash'
import { roomsStore } from '../../../stores'

const { size } = lodash

import {
    initializeVoting,
    vote,
    didAllVote,
    getRemainingVotesCount,
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
                iza: true
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
                iza: true
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
})
