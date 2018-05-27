import { cloneDeep, size } from 'lodash'
import { PlayerRole } from '../../../Dictionary'
import { roomsStore } from '../../../stores'

import {
    toggleVeto,
    addVetoVote,
    didVetoSucceed,
    getVetoVotes,
    clearVetoVotes,
    isVetoUnlocked,
} from '../veto'
import { initializeRoom } from '../rooms'

// TODO: those tests are not implemented
// didVetoSucceed,
// getVetoVotes,
// clearVetoVotes,
// isVetoUnlocked,

describe('veto', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(roomsStore)).toEqual(1)
    })

    describe('toggleVeto', () => {
        test('should set isVetoUnlocked to true and not mess other things up', () => {
            const { testRoom } = roomsStore
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.isVetoUnlocked = true
            toggleVeto('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })
    })

    describe('addVetoVote', () => {
        test('should be able to add president vote into votes ', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                role: PlayerRole.ROLE_PRESIDENT,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT]

            addVetoVote('testRoom', 'ala')
            expect(preparedRoomProps).toEqual(testRoom)
        })
        test('should be able to add chancellor vote into votes ', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                role: PlayerRole.ROLE_CHANCELLOR,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR]

            addVetoVote('testRoom', 'ala')
            expect(preparedRoomProps).toEqual(testRoom)
        })
        test('should be able to add chancellor and president votes into votes ', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                role: PlayerRole.ROLE_CHANCELLOR,
            }
            testRoom.playersDict.ola = {
                role: PlayerRole.ROLE_PRESIDENT,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            addVetoVote('testRoom', 'ala')
            addVetoVote('testRoom', 'ola')

            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should be able to add president and chancellor votes into votes ', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                role: PlayerRole.ROLE_CHANCELLOR,
            }
            testRoom.playersDict.ola = {
                role: PlayerRole.ROLE_PRESIDENT,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT, PlayerRole.ROLE_CHANCELLOR]

            addVetoVote('testRoom', 'ola')
            addVetoVote('testRoom', 'ala')

            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should not add more than 2 votes ever', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                role: PlayerRole.ROLE_CHANCELLOR,
            }
            testRoom.playersDict.ela = {
                role: PlayerRole.ROLE_CHANCELLOR,
            }
            testRoom.playersDict.iza = {
                role: PlayerRole.ROLE_PRESIDENT,
            }
            testRoom.playersDict.aza = {
                role: PlayerRole.ROLE_PRESIDENT,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            addVetoVote('testRoom', 'ala')
            addVetoVote('testRoom', 'ela')

            addVetoVote('testRoom', 'iza')
            addVetoVote('testRoom', 'aza')

            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('non-president and non-chancellor cannot vote for veto', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict.ala = {
                role: null,
            }
            testRoom.playersDict.iza = {
                role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR,
            }
            testRoom.playersDict.ola = {
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.vetoVotes = []

            addVetoVote('testRoom', 'ala')
            addVetoVote('testRoom', 'iza')
            addVetoVote('testRoom', 'ola')

            expect(preparedRoomProps).toEqual(testRoom)
        })
    })
})
