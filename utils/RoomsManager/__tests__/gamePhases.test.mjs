import { size } from 'lodash'
import { GamePhases, PlayerRole } from '../../../Dictionary'
import { getAllRooms, getRoom, updateRoom } from '../../../stores'

import * as roles from '../roles'
import {
    getGamePhase,
    setGamePhase,
    startChancellorChoicePhase,
} from '../gamePhases'
import { initializeRoom } from '../rooms'

// TODO: not implemented functions
// getGamePhase,
// setGamePhase,

describe('gamePhases', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })

    describe('startChancellorChoicePhase', () => {
        test('should set president backup and president if designatedPresidentName is passed', () => {
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
                        slotNumber: 1,
                    },
                    player3: {
                        playerName: 'player3',
                        role: null,
                        slotNumber: 1,
                    },
                },
            })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            preparedRoomProps.previousPresidentNameBackup = 'player1'
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT

            startChancellorChoicePhase('testRoom', 'player3')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('should call chooseNextPresident', () => {
            const chooseNextPresidentMock = jest.spyOn(roles, 'chooseNextPresident').mockImplementationOnce(jest.fn())
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE

            startChancellorChoicePhase('testRoom')
            expect(chooseNextPresidentMock).toHaveBeenCalled()

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('clears veto votes', () => {
            jest.spyOn(roles, 'chooseNextPresident').mockImplementationOnce(jest.fn())
            updateRoom('testRoom', { vetoVotes: ['a', 'b'] })
            const preparedRoomProps = getRoom('testRoom')
            preparedRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            preparedRoomProps.vetoVotes = []

            startChancellorChoicePhase('testRoom')

            const testRoom = getRoom('testRoom')
            expect(testRoom).toEqual(preparedRoomProps)
        })
    })
})
