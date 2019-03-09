import { cloneDeep, size } from 'lodash'
import { PlayerRole } from '../../../Dictionary'
import { getAllRooms, getRoom } from '../../../stores'

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
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {}
            testRoom.playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 1,
            }
            testRoom.playersDict.player2 = {
                playerName: 'player2',
                role: null,
                slotNumber: 2,
            }
            testRoom.playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            chooseNextPresident('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 3)', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {}
            testRoom.playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            testRoom.playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            testRoom.playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.playersDict.player1.role = null
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT
            chooseNextPresident('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should choose next new president (normal flow, 3 players, 3 -> 1, should use modulo)', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {}
            testRoom.playersDict.player1 = {
                playerName: 'player1',
                role: null,
                slotNumber: 1,
            }
            testRoom.playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 2,
            }
            testRoom.playersDict.player3 = {
                playerName: 'player3',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 3,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            preparedRoomProps.playersDict.player2.role = null
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            chooseNextPresident('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should choose next new president (normal flow, 3 players, 1 -> 3, should ommit dead)', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {}
            testRoom.playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 1,
            }
            testRoom.playersDict.player2 = {
                playerName: 'player2',
                role: null,
                isDead: true,
                slotNumber: 2,
            }
            testRoom.playersDict.player3 = {
                playerName: 'player3',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 3,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player2.role = null
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT
            chooseNextPresident('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 1, should ommit dead and use modulo)', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {}
            testRoom.playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            testRoom.playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            testRoom.playersDict.player3 = {
                playerName: 'player3',
                role: null,
                isDead: true,
                slotNumber: 3,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player3.role = null
            chooseNextPresident('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should choose next new president (special flow, 4 players, 1 -> 2 -> 2 (and 2nd was special president))', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {}
            testRoom.previousPresidentNameBackup = 'player1'
            testRoom.playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            testRoom.playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            testRoom.playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            testRoom.playersDict.player4 = {
                playerName: 'player4',
                role: null,
                isDead: true,
                slotNumber: 4,
            }
            const preparedRoomProps = cloneDeep(testRoom)
            preparedRoomProps.playersDict.player1.role = null
            preparedRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            preparedRoomProps.playersDict.player3.role = null
            preparedRoomProps.playersDict.player4.role = null
            preparedRoomProps.previousPresidentNameBackup = null
            chooseNextPresident('testRoom')
            expect(preparedRoomProps).toEqual(testRoom)
        })
    })

    describe('setPresidentBackup', () => {
        test('Should set president backup', () => {
            const testRoom = getRoom('testRoom')
            testRoom.playersDict = {
                player1: {
                    playerName: 'player1',
                    role: PlayerRole.ROLE_PRESIDENT,
                    slotNumber: 1,
                },
            }
            const preparedRoomProps = cloneDeep(testRoom)
            setPresidentBackup('testRoom')
            preparedRoomProps.previousPresidentNameBackup = 'player1'

            expect(preparedRoomProps).toEqual(testRoom)
        })
    })

    describe('resetPresidentBackup', () => {
        test('Should reset president backup', () => {
            const testRoom = getRoom('testRoom')
            const preparedRoomProps = cloneDeep(testRoom)
            resetPresidentBackup('testRoom')
            preparedRoomProps.previousPresidentNameBackup = null

            expect(preparedRoomProps).toEqual(testRoom)
        })
    })
})
