import { size } from 'lodash'
import { PlayerRole } from '../../../../Dictionary'
import { getAllRooms, getRoom, updateRoom } from '../../../stores'

import {
    getPlayerRole,
    setChancellor,
    getChancellor,
    getChancellorCandidateInfo,
    setPresident,
    getPresident,
    chooseNextPresident,
    getRoleSocket,
    setPresidentBackup,
    resetPresidentBackup,
} from '../roles'
import { initializeRoom } from '../rooms'

// TODO: Not implemented tests
// getPlayerRole,
// setChancellor,
// getChancellor,
// getChancellorCandidateInfo,
// setPresident,
// getPresident,
// getRoleSocket,

describe('roles', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })

    describe('chooseNextPresident', () => {
        test('should choose next new president (normal flow, 3 players)', () => {
            updateRoom('testRoom', {
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 1,
                    },
                    player2: {
                        playerName: 'player2',
                        role: null,
                        slotNumber: 2,
                    },
                    player3: {
                        playerName: 'player3',
                        role: null,
                        slotNumber: 3,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT

            chooseNextPresident('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 3)', () => {
            updateRoom('testRoom', {
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                        slotNumber: 1,
                    },
                    player2: {
                        playerName: 'player2',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 2,
                    },
                    player3: {
                        playerName: 'player3',
                        role: null,
                        slotNumber: 3,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.playersDict.player1.role = null
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT

            chooseNextPresident('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should choose next new president (normal flow, 3 players, 3 -> 1, should use modulo)', () => {
            updateRoom('testRoom', {
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: null,
                        slotNumber: 1,
                    },
                    player2: {
                        playerName: 'player2',
                        role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                        slotNumber: 2,
                    },
                    player3: {
                        playerName: 'player3',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 3,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            preparedRoomProps.playersDict.player2.role = null
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT

            chooseNextPresident('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should choose next new president (normal flow, 3 players, 1 -> 3, should ommit dead)', () => {
            updateRoom('testRoom', {
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 1,
                    },
                    player2: {
                        playerName: 'player2',
                        role: null,
                        isDead: true,
                        slotNumber: 2,
                    },
                    player3: {
                        playerName: 'player3',
                        role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                        slotNumber: 3,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player2.role = null
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT

            chooseNextPresident('testRoom')
            
            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 1, should ommit dead and use modulo)', () => {
            updateRoom('testRoom', {
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                        slotNumber: 1,

                    },
                    player2: {
                        playerName: 'player2',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 2,
                    },
                    player3: {
                        playerName: 'player3',
                        role: null,
                        isDead: true,
                        slotNumber: 3,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player3.role = null

            chooseNextPresident('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should choose next new president (special flow, 4 players, 1 -> 2 -> 2 (and 2nd was special president))', () => {
            updateRoom('testRoom', {
                previousPresidentNameBackup: 'player1',
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                        slotNumber: 1,

                    },
                    player2: {
                        playerName: 'player2',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 2,
                    },
                    player3: {
                        playerName: 'player3',
                        role: null,
                        slotNumber: 3,
                    },
                    player4: {
                        playerName: 'player4',
                        role: null,
                        isDead: true,
                        slotNumber: 4,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.playersDict.player1.role = null
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            preparedRoomProps.playersDict.player3.role = null
            preparedRoomProps.playersDict.player4.role = null
            preparedRoomProps.previousPresidentNameBackup = null

            chooseNextPresident('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
    })

    describe('setPresidentBackup', () => {
        test('Should set president backup', () => {
            updateRoom('testRoom', {
                playersDict: {
                    player1: {
                        playerName: 'player1',
                        role: PlayerRole.ROLE_PRESIDENT,
                        slotNumber: 1,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.previousPresidentNameBackup = 'player1'

            setPresidentBackup('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
    })

    describe('resetPresidentBackup', () => {
        test('Should reset president backup', () => {
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.previousPresidentNameBackup = null

            resetPresidentBackup('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
    })
})
