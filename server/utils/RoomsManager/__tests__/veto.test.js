import { size } from 'lodash'
import { PlayerRole } from '../../../../../Dictionary'
import { getAllRooms, getRoom, updateRoom } from '../../../stores'

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
        expect(size(getAllRooms())).toEqual(1)
    })

    describe('toggleVeto', () => {
        test('should set isVetoUnlocked to true and not mess other things up', () => {
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.isVetoUnlocked = true

            toggleVeto('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
    })

    describe('addVetoVote', () => {
        test('should be able to add president vote into votes ', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        role: PlayerRole.ROLE_PRESIDENT,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT]

            addVetoVote('testRoom', 'ala')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
        test('should be able to add chancellor vote into votes ', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        role: PlayerRole.ROLE_CHANCELLOR,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR]

            addVetoVote('testRoom', 'ala')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
        test('should be able to add chancellor and president votes into votes ', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        role: PlayerRole.ROLE_CHANCELLOR,
                    },
                    ola: {
                        role: PlayerRole.ROLE_PRESIDENT,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            addVetoVote('testRoom', 'ala')
            addVetoVote('testRoom', 'ola')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should be able to add president and chancellor votes into votes ', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        role: PlayerRole.ROLE_CHANCELLOR,
                    },
                    ola: {
                        role: PlayerRole.ROLE_PRESIDENT,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT, PlayerRole.ROLE_CHANCELLOR]

            addVetoVote('testRoom', 'ola')
            addVetoVote('testRoom', 'ala')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should not add more than 2 votes ever', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        role: PlayerRole.ROLE_CHANCELLOR,
                    },
                    ela: {
                        role: PlayerRole.ROLE_CHANCELLOR,
                    },
                    iza: {
                        role: PlayerRole.ROLE_PRESIDENT,
                    },
                    aza: {
                        role: PlayerRole.ROLE_PRESIDENT,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            addVetoVote('testRoom', 'ala')
            addVetoVote('testRoom', 'ela')

            addVetoVote('testRoom', 'iza')
            addVetoVote('testRoom', 'aza')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('non-president and non-chancellor cannot vote for veto', () => {
            updateRoom('testRoom', {
                playersDict: {
                    ala: {
                        role: null,
                    },
                    iza: {
                        role: PlayerRole.ROLE_PREVIOUS_CHANCELLOR,
                    },
                    ola: {
                        role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.vetoVotes = []

            addVetoVote('testRoom', 'ala')
            addVetoVote('testRoom', 'iza')
            addVetoVote('testRoom', 'ola')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
    })
})
