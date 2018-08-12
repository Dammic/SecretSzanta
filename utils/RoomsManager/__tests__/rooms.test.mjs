import { cloneDeep, size, times, forEach, reduce } from 'lodash'
import { GamePhases, PlayerRole, PlayerBoards, PolicyCards, PlayerAffilications, WinReasons } from '../../../Dictionary'
import { roomsStore } from '../../../stores'
import {
    initializeRoom,
    setPlayerboardType,
    checkWinConditions,
    getPlayerboardType,
    startGame,
    getRoomsList,
    getRoomDetailsForLobby,
    getRoomDetails,
    isRoomPresent,
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
// isRoomPresent,
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
        expect(size(roomsStore)).toEqual(1)
    })
    describe('initializeRoom', () => {
        test('should create room with owner', () => {
            initializeRoom('testRoom', 'owner', 8, 'password')
            const { testRoom } = roomsStore
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
            const { testRoom } = roomsStore
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
            11: undefined,
        }
        forEach(expectedResults, (expectedBoardSize, playersCount) => {
            test(`Should set ${expectedBoardSize} for ${playersCount} players`, () => {
                const { testRoom } = roomsStore
                testRoom.playersDict = generatePlayersDict(playersCount)
                const preparedRoomProps = cloneDeep(testRoom)
                preparedRoomProps.boardType = expectedBoardSize
                setPlayerboardType('testRoom')
                expect(preparedRoomProps).toEqual(testRoom)
            })
        })
    })
    describe('getPlayerboardType', () => {
        test('should retrieve the boardType from roomsStore', () => {
            const { testRoom } = roomsStore
            testRoom.boardType = PlayerBoards.SmallBoard

            expect(getPlayerboardType('testRoom')).toEqual(PlayerBoards.SmallBoard)
        })
    })

    describe('checkWinConditions', () => {
        test('Should return liberal affiliation if liberal policies count === 5', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(2, () => PolicyCards.FacistPolicy),
                ...times(5, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.LIBERAL_AFFILIATION,
                reason: WinReasons.fiveLiberalCards,
            })
        })

        test('Should return liberal affiliation if liberal policies count < 5, but hitler is dead', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(2, () => PolicyCards.FacistPolicy),
                ...times(4, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: true,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.LIBERAL_AFFILIATION,
                reason: WinReasons.hitlerDead,
            })
        })

        test('Should not return liberal affiliation if liberal policies count < 5, but hitler is alive', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(2, () => PolicyCards.FacistPolicy),
                ...times(4, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: null,
                reason: null,
            })
        })

        test('Should return fascist affiliation if fascist policies count === 6', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(6, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.sixFascistCards,
            })
        })

        test('Should return fascist affiliation if fascist policies === 4 AND hitler is chancellor', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(4, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: PlayerRole.ROLE_CHANCELLOR,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.hitlerBecameChancellor,
            })
        })

        test('Should return fascist affiliation if fascist policies === 5 AND hitler is chancellor', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(5, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: PlayerRole.ROLE_CHANCELLOR,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.hitlerBecameChancellor,
            })
        })

        test('Should not return fascist affiliation if fascist policies < 4 AND hitler is chancellor', () => {
            const { testRoom } = roomsStore
            testRoom.policiesPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            testRoom.playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: PlayerRole.ROLE_CHANCELLOR,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: null,
                reason: null,
            })
        })
    })
})
