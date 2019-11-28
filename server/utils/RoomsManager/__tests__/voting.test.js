import { size } from 'lodash'
import { getAllRooms, getRoom, updateRoom } from '../../../stores'

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

import { PlayerRole } from '../../../../Dictionary'

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
        expect(size(getAllRooms())).toEqual(1)
    })
    describe('didAllVote', () => {
        test('all eligible voted (1 dead person)', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: false, playerName: 'ala' },
                    ola: { isDead: true, playerName: 'ola' },
                    ula: { isDead: false, playerName: 'ula' },
                    iza: { isDead: false, playerName: 'iza' },
                },
                votes: {
                    ala: true,
                    ula: false,
                    iza: true,
                },
            })
            const result = didAllVote('testRoom')

            expect(result).toEqual(true)
        })

        test('not all eligible voted', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: false, playerName: 'ala' },
                    ula: { isDead: false, playerName: 'ula' },
                    iza: { isDead: false, playerName: 'iza' },
                },
                votes: {
                    ala: true,
                    iza: true,
                },
            })
            const result = didAllVote('testRoom')

            expect(result).toEqual(false)
        })

        test('dead person voted, for some reason and should not take it into consideration', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: true, playerName: 'ala' },
                    ula: { isDead: false, playerName: 'ula' },
                    iza: { isDead: false, playerName: 'iza' },
                },
                votes: {
                    ala: true,
                    ula: false,
                },
            })
            const result = didAllVote('testRoom')

            expect(result).toEqual(false)
        })
    })

    describe('getRemainingVotingPlayers', () => {
        test('returns players that did not vote', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: true, playerName: 'ala' },
                    ula: { isDead: false, playerName: 'ula' },
                    iza: { isDead: false, playerName: 'iza' },
                },
                votes: {
                    ula: false,
                },
            })
            
            let result = getRemainingVotingPlayers('testRoom')
            expect(result).toEqual(['iza'])
            updateRoom('testRoom', {
                votes: {
                    ula: false,
                    iza: true,
                },
            })

            result = getRemainingVotingPlayers('testRoom')
            expect(result).toEqual([])
        })

        test('returns players that did not vote #2', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: true, playerName: 'ala' },
                    ula: { isDead: false, playerName: 'ula' },
                    iza: { isDead: false, playerName: 'iza' },
                },
                votes: {},
            })
            const result = getRemainingVotingPlayers('testRoom')

            expect(result).toEqual(['ula', 'iza'])
        })
    })

    describe('getChancellorChoices', () => {
        test('returns everyone, but the previous chancelor if less than 6 players', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: false, playerName: 'ala', role: PlayerRole.ROLE_PREVIOUS_PRESIDENT},
                    ula: { isDead: false, playerName: 'ula', role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR },
                    iza: { isDead: false, playerName: 'iza' },
                    aga: { isDead: false, playerName: 'aga' },
                    staszek: { isDead: false, playerName: 'staszek' },
                    miłosz: { isDead: true, playerName: 'miłosz' },
                },
            })

            const result = getChancellorChoices('testRoom')
            expect(result).toEqual(['ala', 'iza', 'aga', 'staszek'])
        })

        test('returns everyone who\'s not the previous president or chancelor if more than 5 players', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: { isDead: false, playerName: 'ala', role: PlayerRole.ROLE_PREVIOUS_PRESIDENT},
                    ula: { isDead: false, playerName: 'ula', role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR },
                    iza: { isDead: false, playerName: 'iza' },
                    aga: { isDead: false, playerName: 'aga' },
                    staszek: { isDead: false, playerName: 'staszek' },
                    miłosz: { isDead: false, playerName: 'miłosz' },
                },
            })

            const result = getChancellorChoices('testRoom')
            expect(result).toEqual(['iza', 'aga', 'staszek', 'miłosz'])
        })
    })
})
