import { size } from 'lodash'
import { PlayerAffilications } from '../../../Dictionary'
import { getAllRooms, getRoom } from '../../../stores'

import {
    getFacists,
    getLiberals,
    getHitler,
} from '../secretRoles'
import { initializeRoom } from '../rooms'

// TODO: not implemented tests:
// getFacists,
// getLiberals,

describe('secretRoles', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })
    describe('getHitler', () => {
        test('it returns hitler if one is on the board', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {
                hitlerPlayer: {
                    playerName: 'hitlerPlayer',
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
                fascistPlayer: {
                    playerName: 'fascistPlayer',
                    affiliation: PlayerAffilications.FACIST_AFFILIATION,
                },
                liberalPlayer: {
                    playerName: 'liberalPlayer',
                    affiliation: PlayerAffilications.LIBERAL_AFFILIATION,
                },
            }
            expect(getHitler('testRoom')).toEqual(testRoom.playersDict.hitlerPlayer)
        })
        test('it returns null', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {
                fascistPlayer: {
                    playerName: 'fascistPlayer',
                    affiliation: PlayerAffilications.FACIST_AFFILIATION,
                },
                liberalPlayer: {
                    playerName: 'liberalPlayer',
                    affiliation: PlayerAffilications.LIBERAL_AFFILIATION,
                },
            }
            expect(getHitler('testRoom')).toEqual(undefined)
        })
    })
})
