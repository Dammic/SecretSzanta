import lodash from 'lodash'
import { GamePhases, PlayerRole } from '../../../Dictionary'
import { roomsStore } from '../../../stores'

import * as roles from '../roles'
import {
    getGamePhase,
    setGamePhase,
    startChancellorChoicePhase,
} from '../gamePhases'
import { initializeRoom } from '../rooms'

const { cloneDeep, size } = lodash

// TODO: not implemented functions
// getGamePhase,
// setGamePhase,

describe('gamePhases', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(roomsStore)).toEqual(1)
    })

    describe('startChancellorChoicePhase', () => {
        test('should set president backup and president if designatedPresidentName is passed', () => {
            const { testRoom } = roomsStore
            testRoom.playersDict = {
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
                }
            }
            const preparedRoomProps = cloneDeep(testRoom)
            startChancellorChoicePhase('testRoom', 'player3')
            preparedRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            preparedRoomProps.previousPresidentNameBackup = 'player1'
            preparedRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            preparedRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT

            expect(preparedRoomProps).toEqual(testRoom)
        })

        test('should call chooseNextPresident', () => {
            const { testRoom } = roomsStore
            const preparedRoomProps = cloneDeep(testRoom)
            const chooseNextPresidentMock = jest.spyOn(roles, 'chooseNextPresident').mockImplementationOnce(jest.fn())

            startChancellorChoicePhase('testRoom')

            preparedRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            expect(chooseNextPresidentMock).toHaveBeenCalled()
            expect(preparedRoomProps).toEqual(testRoom)
        })
    })
})
