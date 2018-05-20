import lodash from 'lodash'
import { GamePhases, PlayerRole, PlayerBoards, PolicyCards, PlayerAffilications, WinReasons } from '../../../Dictionary'
import RoomsManagerModule from '../RoomsManager'
import roomsStore from '../roomsStore'
let RoomsManager;

const { cloneDeep, size, times, forEach, reduce, countBy } = lodash


describe('RoomsManager', () => {
    beforeEach(() => {
        RoomsManager = new RoomsManagerModule()
        RoomsManager.initializeRoom('testRoom')
        RoomsManager.players = {}
        
    });
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(roomsStore)).toEqual(1)
    });
    describe('initializeRoom', () => {
        test('should create room with owner', () => {
            RoomsManager.initializeRoom('testRoom', 'owner', 8, 'password')
            const roomProps = roomsStore.testRoom
            expect(roomProps).toBeDefined()

            expect(roomProps).toEqual({
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
            RoomsManager.initializeRoom('testRoom')
            const roomProps = roomsStore.testRoom
            expect(roomProps).toBeDefined()

            expect(roomProps).toEqual({
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
    describe('isInBlackList', () => {
        test('if blacklist is empty, should return false', () => {
            const roomProps = roomsStore
            roomProps['testRoom'].blackList = []

            expect(RoomsManager.isInBlackList('testRoom', 'ala')).toEqual(false)
        })

        test('if blacklist contains the user, should return true', () => {
            const roomProps = roomsStore;
            roomProps['testRoom'].blackList = ['ala', 'ola']

            expect(RoomsManager.isInBlackList('testRoom', 'ala' )).toEqual(true)
        })

        test('if blacklist contains some users but not this one, should return false', () => {
            const roomProps = roomsStore
            roomProps['testRoom'].blackList = ['olga', 'ola']

            expect(RoomsManager.isInBlackList('testRoom', 'ala' )).toEqual(false)
        })
    })

    describe('toggleVeto', () => {
        test('should set isVetoUnlocked to true and not mess other things up', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.isVetoUnlocked = true
            RoomsManager.toggleVeto('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
    })

    describe('addVetoVote', () => {
        test('should be able to add president vote into votes ', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT]
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            
            RoomsManager.addVetoVote('testRoom', 'ala')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
        test('should be able to add chancellor vote into votes ', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR]
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            
            RoomsManager.addVetoVote('testRoom', 'ala')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
        test('should be able to add chancellor and president votes into votes ', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'ala')

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'ola')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should be able to add president and chancellor votes into votes ', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT, PlayerRole.ROLE_CHANCELLOR]

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'ola')

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'ala')

            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should not add more than 2 votes ever', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'ala')
            RoomsManager.addVetoVote('testRoom', 'ela')

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'iza')
            RoomsManager.addVetoVote('testRoom', 'aza')

            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('non-president and non-chancellor cannot vote for veto', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.vetoVotes = []

            RoomsManager.getPlayerRole = () => null
            RoomsManager.addVetoVote('testRoom', 'ala')
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PREVIOUS_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'iza')
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PREVIOUS_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'ola')

            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
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
                roomsStore['testRoom'].playersDict = generatePlayersDict(playersCount)
                const initialRoomProps = cloneDeep(roomsStore['testRoom'])
                initialRoomProps.boardType = expectedBoardSize
                RoomsManager.setPlayerboardType('testRoom')
                expect(initialRoomProps).toEqual(roomsStore['testRoom'])
            })
        })
    })
    describe('getPlayerboardType', () => {
        test('should retrieve the boardType from roomsStore', () => {
            const roomProps = roomsStore
            roomProps['testRoom'].boardType = PlayerBoards.SmallBoard

            expect(RoomsManager.getPlayerboardType('testRoom')).toEqual(PlayerBoards.SmallBoard)
        })
    })
    describe('chooseNextPresident', () => {
        test('should choose next new president (normal flow, 3 players)', () => {
            roomsStore['testRoom'].playersDict = {}
            roomsStore['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 1,
            }
            roomsStore['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: null,
                slotNumber: 2,
            }
            roomsStore['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 3)', () => {
            roomsStore['testRoom'].playersDict = {}
            roomsStore['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            roomsStore['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            roomsStore['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.playersDict.player1.role = null
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 3 -> 1, should use modulo)', () => {
            roomsStore['testRoom'].playersDict = {}
            roomsStore['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: null,
                slotNumber: 1,
            }
            roomsStore['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 2,
            }
            roomsStore['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            initialRoomProps.playersDict.player2.role = null
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 1 -> 3, should ommit dead)', () => {
            roomsStore['testRoom'].playersDict = {}
            roomsStore['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 1,
            }
            roomsStore['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: null,
                isDead: true,
                slotNumber: 2,
            }
            roomsStore['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player2.role = null
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 1, should ommit dead and use modulo)', () => {
            roomsStore['testRoom'].playersDict = {}
            roomsStore['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            roomsStore['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            roomsStore['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                isDead: true,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player3.role = null
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should choose next new president (special flow, 4 players, 1 -> 2 -> 2 (and 2nd was special president))', () => {
            roomsStore['testRoom'].playersDict = {}
            roomsStore['testRoom'].previousPresidentNameBackup = 'player1'
            roomsStore['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            roomsStore['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            roomsStore['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            roomsStore['testRoom'].playersDict.player4 = {
                playerName: 'player4',
                role: null,
                isDead: true,
                slotNumber: 4,
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.playersDict.player1.role = null
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            initialRoomProps.playersDict.player3.role = null
            initialRoomProps.playersDict.player4.role = null
            initialRoomProps.previousPresidentNameBackup = null
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
    })

    describe('startChancellorChoicePhase', () => {
        test('should set president backup and president if designatedPresidentName is passed', () => {
            roomsStore['testRoom'].playersDict = {
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
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            RoomsManager.startChancellorChoicePhase('testRoom', 'player3')
            initialRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            initialRoomProps.previousPresidentNameBackup = 'player1'
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT

            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })

        test('should call chooseNextPresident', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            RoomsManager.chooseNextPresident = jest.fn()
            RoomsManager.startChancellorChoicePhase('testRoom')
            initialRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            expect(RoomsManager.chooseNextPresident.mock.calls.length).toBe(1)
            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
    })

    describe('setPresidentBackup', () => {
        test('Should set president backup', () => {
            roomsStore['testRoom'].playersDict = {
                player1: {
                    playerName: 'player1',
                    role: PlayerRole.ROLE_PRESIDENT,
                    slotNumber: 1,
                },
            }
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            RoomsManager.setPresidentBackup('testRoom')
            initialRoomProps.previousPresidentNameBackup = 'player1'

            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
    })

    describe('resetPresidentBackup', () => {
        test('Should reset president backup', () => {
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            RoomsManager.resetPresidentBackup('testRoom')
            initialRoomProps.previousPresidentNameBackup = null

            expect(initialRoomProps).toEqual(roomsStore['testRoom'])
        })
    })

    describe('moveCard', () => {
        test('Policy card is removed from drawn card pile and added to discard pile', () => {
            const room = roomsStore['testRoom']
            room.drawPile = [PolicyCards.LiberalPolicy]
            room.discardPile = []
            RoomsManager.moveCard(room.drawPile, room.discardPile, room.drawPile[0])
            expect(room.drawPile).toEqual([])
            expect(room.discardPile).toEqual([PolicyCards.LiberalPolicy])
        })

        test('Non-existing policy in source pile is not moved to other pile', () => {
            const room = roomsStore['testRoom']
            room.drawPile = []
            room.discardPile = []
            RoomsManager.moveCard(room.drawPile, room.discardPile, PolicyCards.LiberalPolicy)
            expect(room.drawPile).toEqual([])
            expect(room.discardPile).toEqual([])
        })

        test('Only chosen policy is moved to another pile', () => {
            const room = roomsStore['testRoom']
            room.drawPile = [PolicyCards.LiberalPolicy, PolicyCards.FacistPolicy]
            room.discardPile = []
            const cardToStay = room.drawPile[1]
            RoomsManager.moveCard(room.drawPile, room.discardPile, room.drawPile[0])
            expect(room.drawPile).toEqual([cardToStay])
            expect(room.discardPile).toEqual([PolicyCards.LiberalPolicy])
        })
    })

    const checkIfCardsMatch = (expectedCards, receivedCards) => {
        const expectedCardsGroupedCount = countBy(expectedCards)
        const receivedCardsGroupedCount = countBy(receivedCards)
        return (
            (expectedCardsGroupedCount[PolicyCards.FacistPolicy] === receivedCardsGroupedCount[PolicyCards.FacistPolicy])
            && (expectedCardsGroupedCount[PolicyCards.LiberalPolicy] === receivedCardsGroupedCount[PolicyCards.LiberalPolicy])
        )
    }
    describe('helper function checkuIfCardsMatch', () => {
        test('checkIfCardsMatch should return true for the same entry arrays', () => {
            expect(checkIfCardsMatch(
                [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy],
                [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.FacistPolicy],
            )).toEqual(true)
        })
        test('checkIfCardsMatch should return false for the different entry arrays', () => {
            expect(checkIfCardsMatch(
                [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy],
                [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.FacistPolicy],
            )).toEqual(false)
        })
        test('checkIfCardsMatch should return false if one array is part of another', () => {
            expect(checkIfCardsMatch(
                [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy],
                [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy],
            )).toEqual(false)
        })
    })

    const checkIfRoomsCardsMatch = (first, second) => checkIfCardsMatch(
        [
            ...first.drawPile,
            ...first.discardPile,
            ...first.drawnCards,
        ], [
            ...second.drawPile,
            ...second.discardPile,
            ...second.drawnCards,
        ],
    )

    describe('reShuffle', () => {
        test('The same cards stay after reShuffle', () => {
            RoomsManager.drawPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy]
            RoomsManager.discardPile = [PolicyCards.LiberalPolicy]
            const room = roomsStore['testRoom']
            const initialRoom = cloneDeep(room)
            RoomsManager.reShuffle('testRoom')
            expect(room.discardPile).toEqual([])
            expect(checkIfCardsMatch(
                room.drawPile,
                [...initialRoom.drawPile, ...initialRoom.discardPile],
            )).toEqual(true)
            
        })
    })

    describe('takeChoicePolicyCards', () => {
        test('Should take 1 out of 4 cards', () => {
            roomsStore['testRoom'].drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            roomsStore['testRoom'].discardPile = [PolicyCards.FacistPolicy]
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            initialRoomProps.discardPile = [PolicyCards.FacistPolicy]
            initialRoomProps.drawnCards = [PolicyCards.FacistPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 1)
            
            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            expect(roomsStore['testRoom']).toEqual(initialRoomProps)
        })
        test('Should take 2 out of 4 cards and shuffle the rest with discards', () => {
            roomsStore['testRoom'].drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            roomsStore['testRoom'].discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.drawPile = [
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            initialRoomProps.discardPile = []
            initialRoomProps.drawnCards = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 2)

            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            initialRoomProps.drawPile = roomsStore['testRoom'].drawPile
            expect(roomsStore['testRoom']).toEqual(initialRoomProps)
            expect(roomsStore['testRoom'].drawPile.length).toEqual(5)
        })

        test('Should take 1 out of 1 cards and shuffle the rest with discards', () => {
            roomsStore['testRoom'].drawPile = [PolicyCards.LiberalPolicy]
            roomsStore['testRoom'].discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            initialRoomProps.discardPile = []
            initialRoomProps.drawnCards = [PolicyCards.LiberalPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 1)

            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            initialRoomProps.drawPile = roomsStore['testRoom'].drawPile
            expect(roomsStore['testRoom']).toEqual(initialRoomProps)
            expect(roomsStore['testRoom'].drawPile.length).toEqual(3)
        })

        test('Should take 1 out of 3 cards and shuffle the rest with discards', () => {
            roomsStore['testRoom'].drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
            ]
            roomsStore['testRoom'].discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            initialRoomProps.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            initialRoomProps.discardPile = []
            initialRoomProps.drawnCards = [PolicyCards.FacistPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 1)

            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            initialRoomProps.drawPile = roomsStore['testRoom'].drawPile
            expect(roomsStore['testRoom']).toEqual(initialRoomProps)
            expect(roomsStore['testRoom'].drawPile.length).toEqual(5)
        })
        test('Should take 3 cards, but first shuffle, because there is only one available on draw pile', () => {
            roomsStore['testRoom'].drawPile = [
                PolicyCards.FacistPolicy,
            ] 
            roomsStore['testRoom'].discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])

            RoomsManager.takeChoicePolicyCards('testRoom', 3)

            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)
            expect(checkIfCardsMatch(
                [ PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy ],
                roomsStore['testRoom'].drawnCards,
            )).toEqual(true)
        })
    })

    describe('discardPolicy', () => {
        test(`If no card is passed then it reports error, any pile isn't changed`, () => {
            const { testRoom } = roomsStore;
            testRoom.drawPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            const initialRoomProps = cloneDeep(testRoom)

            RoomsManager.discardPolicy('testRoom', undefined)
            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                testRoom,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                initialRoomProps.drawPile,
                testRoom.drawPile,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                initialRoomProps.discardPile,
                testRoom.discardPile,
            )).toEqual(true)
        })

        test('Should move chosen card from drawn cards pile to discard pile', () => {
            const testRoom = roomsStore.testRoom
            testRoom.drawPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            const initialRoomProps = cloneDeep(testRoom)

            RoomsManager.discardPolicy('testRoom', testRoom.drawPile[3])
            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                testRoom,
            )).toEqual(true)
        })

        test('If card does not exist in draw pile, then error is reported and any pile is not changed', () => {
            const { testRoom } = roomsStore;
            testRoom.drawPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
            ]
            const notPresentCard = PolicyCards.LiberalPolicy
            const initialRoomProps = cloneDeep(testRoom)

            RoomsManager.discardPolicy('testRoom', notPresentCard)

            expect(checkIfRoomsCardsMatch(
                initialRoomProps,
                testRoom,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                initialRoomProps.drawPile,
                testRoom.drawPile,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                initialRoomProps.discardPile,
                testRoom.discardPile,
            )).toEqual(true)
        })
    })

    describe('peekPolicyCards', () => {
        test('Should return 3 cards but not modify anything', () => {
            roomsStore['testRoom'].drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const initialRoomProps = cloneDeep(roomsStore['testRoom'])
            const peekedCards = RoomsManager.peekPolicyCards('testRoom')

            expect(roomsStore['testRoom']).toEqual(initialRoomProps)
            expect(peekedCards).toEqual([PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy])
        })
    })

    describe('checkWinConditions', () => {
        test('Should return liberal affiliation if liberal policies count === 5', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(2, () => PolicyCards.FacistPolicy),
                ...times(5, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.LIBERAL_AFFILIATION,
                reason: WinReasons.fiveLiberalCards,
            })
        })

        test('Should return liberal affiliation if liberal policies count < 5, but hitler is dead', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(2, () => PolicyCards.FacistPolicy),
                ...times(4, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: true,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.LIBERAL_AFFILIATION,
                reason: WinReasons.hitlerDead,
            })
        })

        test('Should not return liberal affiliation if liberal policies count < 5, but hitler is alive', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(2, () => PolicyCards.FacistPolicy),
                ...times(4, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: null,
                reason: null,
            })
        })

        test('Should return fascist affiliation if fascist policies count === 6', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(6, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: null,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.sixFascistCards,
            })
        })

        test('Should return fascist affiliation if fascist policies === 4 AND hitler is chancellor', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(4, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: PlayerRole.ROLE_CHANCELLOR,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.hitlerBecameChancellor,
            })
        })

        test('Should return fascist affiliation if fascist policies === 5 AND hitler is chancellor', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(5, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: PlayerRole.ROLE_CHANCELLOR,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: PlayerAffilications.FACIST_AFFILIATION,
                reason: WinReasons.hitlerBecameChancellor,
            })
        })

        test('Should not return fascist affiliation if fascist policies < 4 AND hitler is chancellor', () => {
            roomsStore['testRoom'].policiesPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            roomsStore['testRoom'].playersDict = {
                hitlerTestPlayer: {
                    isDead: false,
                    role: PlayerRole.ROLE_CHANCELLOR,
                    affiliation: PlayerAffilications.HITLER_AFFILIATION,
                },
            }
            const winningSide = RoomsManager.checkWinConditions('testRoom')
            expect(winningSide).toEqual({
                winningSide: null,
                reason: null,
            })
        })
    })
})
