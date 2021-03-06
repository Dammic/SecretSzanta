import { size, times, forEach, reduce } from 'lodash'
import { GamePhases, PlayerRole, PlayerBoards, PolicyCards, PlayerAffilications, WinReasons } from '../../../../Dictionary'
import { getAllRooms, getRoom, updateRoom } from '../../../stores'
import {
    initializeRoom,
    setPlayerboardType,
    checkWinConditions,
    getPlayerboardType,
    startGame,
    getRoomsList,
    getRoomDetailsForLobby,
    getRoomDetails,
    isRoomPasswordCorrect,
    getRoomOwner,
    findNewRoomOwner,
    getPlayersCount,
    removeRoom,
} from '../rooms'

// TODO: not implmenented tests:
// startGame,
// getRoomsList,
// getRoomDetailsForLobby,
// getRoomDetails,
// getRoomOwner,
// findNewRoomOwner,
// getPlayersCount,
// removeRoom,
// checkIfGameShouldFinish

describe('RoomsManager', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })
    describe('initializeRoom', () => {
        test('should create room with owner', () => {
            initializeRoom('testRoom', 'owner', 8, 'password')
            const testRoom = getRoom('testRoom')
            expect(testRoom).toBeDefined()

            expect(testRoom).toEqual({
                ownerName: 'owner',
                freeSlots: [1, 2, 3, 4, 5, 6, 7, 8],
                playersDict: {},
                blackList: [],
                maxPlayers: 8,
                password: 'password',
                chancellorCandidateName: '',
                failedElectionsCount: 0,
                votes: {},
                gamePhase: GamePhases.GAME_PHASE_NEW,
                drawPile: [],
                drawnCards: [],
                discardPile: [],
                policiesPile: [],
                isVetoUnlocked: false,
                vetoVotes: [],
                boardType: null,
                previousPresidentNameBackup: null,
            })
        })
        test('should create room without owner', () => {
            initializeRoom('testRoom')
            const testRoom = getRoom('testRoom')
            expect(testRoom).toBeDefined()

            expect(testRoom).toEqual({
                ownerName: undefined,
                freeSlots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                playersDict: {},
                blackList: [],
                maxPlayers: 10,
                password: undefined,
                chancellorCandidateName: '',
                failedElectionsCount: 0,
                votes: {},
                gamePhase: GamePhases.GAME_PHASE_NEW,
                drawPile: [],
                drawnCards: [],
                discardPile: [],
                policiesPile: [],
                isVetoUnlocked: false,
                vetoVotes: [],
                boardType: null,
                previousPresidentNameBackup: null,
            })
        })
    })

    describe('setPlayerboardType', () => {
        const generatePlayersDict = (amount) => {
            return reduce(times(amount), (sum, index) => {
                sum[`player${index + 1}`] = {}
                return sum
            }, {})
        }
        test('helper function should generate 5 players', () => {
            expect(generatePlayersDict(5)).toEqual({ player1: {}, player2: {}, player3: {}, player4: {}, player5: {} })
        })
        test('helper function should generate 0 players', () => {
            expect(generatePlayersDict()).toEqual({})
        })
        const expectedResults = {
            5: PlayerBoards.SmallBoard,
            6: PlayerBoards.SmallBoard,
            7: PlayerBoards.MediumBoard,
            8: PlayerBoards.MediumBoard,
            9: PlayerBoards.LargeBoard,
            10: PlayerBoards.LargeBoard,
            11: null,
        }
        forEach(expectedResults, (expectedBoardSize, playersCount) => {
            test(`Should set ${expectedBoardSize} for ${playersCount} players`, () => {
                updateRoom('testRoom', { playersDict: generatePlayersDict(playersCount) })
                const preparedRoomProps = getRoom('testRoom')
                preparedRoomProps.boardType = expectedBoardSize

                setPlayerboardType('testRoom')

                const testRoom = getRoom('testRoom')
                expect(testRoom).toEqual(preparedRoomProps)
            })
        })
    })
    describe('getPlayerboardType', () => {
        test('should retrieve the boardType from roomsStore', () => {
            updateRoom('testRoom', { boardType: PlayerBoards.SmallBoard })

            expect(getPlayerboardType('testRoom')).toEqual(PlayerBoards.SmallBoard)
        })
    })

    describe('getRoomsList', () => {
        test('when room is not secured with a password it has hasPassword property set to false', () => {
            const rooms = getRoomsList()

            expect(rooms['testRoom']).toHaveProperty('hasPassword', false)
        })

        test('when room is secured with a password it has hasPassword property set to true', () => {
            initializeRoom('testRoom', 'owner', 8, 'somePassword')
            const rooms = getRoomsList()

            expect(rooms['testRoom']).toHaveProperty('hasPassword', true)
        })
    })

    describe('checkWinConditions', () => {
        test('Should return liberal affiliation if liberal policies count === 5', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(2, () => PolicyCards.FacistPolicy),
                    ...times(5, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: false,
                        role: null,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })
            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.LIBERAL_AFFILIATION,
                reason: WinReasons.fiveLiberalCards,
            })
        })

        test('Should return liberal affiliation if liberal policies count < 5, but hitler is dead', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(2, () => PolicyCards.FacistPolicy),
                    ...times(4, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: true,
                        role: null,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })

            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.LIBERAL_AFFILIATION,
                reason: WinReasons.hitlerDead,
            })
        })

        test('Should not return liberal affiliation if liberal policies count < 5, but hitler is alive', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(2, () => PolicyCards.FacistPolicy),
                    ...times(4, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: false,
                        role: null,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })

            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: null,
                reason: null,
            })
        })

        test('Should return fascist affiliation if fascist policies count === 6', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(6, () => PolicyCards.FacistPolicy),
                    ...times(2, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: false,
                        role: null,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })

            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.sixFascistCards,
            })
        })

        test('Should return fascist affiliation if fascist policies === 4 AND hitler is chancellor', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(4, () => PolicyCards.FacistPolicy),
                    ...times(2, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: false,
                        role: PlayerRole.ROLE_CHANCELLOR,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })

            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.hitlerBecameChancellor,
            })
        })

        test('Should return fascist affiliation if fascist policies === 5 AND hitler is chancellor', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(5, () => PolicyCards.FacistPolicy),
                    ...times(2, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: false,
                        role: PlayerRole.ROLE_CHANCELLOR,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })

            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.hitlerBecameChancellor,
            })
        })

        test('Should not return fascist affiliation if fascist policies < 4 AND hitler is chancellor', () => {
            updateRoom('testRoom', {
                policiesPile: [
                    ...times(3, () => PolicyCards.FacistPolicy),
                    ...times(2, () => PolicyCards.LiberalPolicy),
                ],
                playersDict: {
                    hitlerTestPlayer: {
                        isDead: false,
                        role: PlayerRole.ROLE_CHANCELLOR,
                        affiliation: PlayerAffilications.HITLER_AFFILIATION,
                    },
                },
            })

            const winningSide = checkWinConditions('testRoom')

            expect(winningSide).toEqual({
                winningSide: null,
                reason: null,
            })
        })
    })
    describe('isRoomPasswordCorrect', () => {
        test('Should always return true when room is not secured', () => {
            const canJoinRoom = isRoomPasswordCorrect('testRoom', 'anyPassword')
            expect(canJoinRoom).toEqual(true)
        })

        test('Should return true only when correct password is passed', () => {
            const correctPassword = 'password'
            initializeRoom('testRoom', 'owner', 8, correctPassword)

            let canJoinRoom = isRoomPasswordCorrect('testRoom', 'anyPassword')
            expect(canJoinRoom).toEqual(false)

            canJoinRoom = isRoomPasswordCorrect('testRoom', correctPassword)
            expect(canJoinRoom).toEqual(true)
        })
    })
})
