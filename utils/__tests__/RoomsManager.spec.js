const { cloneDeep, size, times, forEach, reduce, countBy } = require('lodash')
const { GamePhases, PlayerRole, PlayerBoards, PolicyCards } = require('../../Dictionary')
let RoomsManager;

describe('RoomsManager', () => {
    beforeEach(() => {
        RoomsManager = new (require('../RoomsManager'))()
        RoomsManager.initializeRoom('testRoom')
        RoomsManager.players = {}
    });
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(RoomsManager.rooms_props)).toEqual(1)
    });
    describe('initializeRoom', () => {
        test('should create room with owner', () => {
            RoomsManager.initializeRoom('testRoom', 'owner', 8, 'password')
            const roomProps = RoomsManager.rooms_props.testRoom
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
            const roomProps = RoomsManager.rooms_props.testRoom
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
            const roomProps = RoomsManager.rooms_props
            roomProps['testRoom'].blackList = []

            expect(RoomsManager.isInBlackList('testRoom', 'ala')).toEqual(false)
        })

        test('if blacklist contains the user, should return true', () => {
            const roomProps = RoomsManager.rooms_props;
            roomProps['testRoom'].blackList = ['ala', 'ola']

            expect(RoomsManager.isInBlackList('testRoom', 'ala' )).toEqual(true)
        })

        test('if blacklist contains some users but not this one, should return false', () => {
            const roomProps = RoomsManager.rooms_props
            roomProps['testRoom'].blackList = ['olga', 'ola']

            expect(RoomsManager.isInBlackList('testRoom', 'ala' )).toEqual(false)
        })
    })

    describe('toggleVeto', () => {
        test('should set isVetoUnlocked to true and not mess other things up', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.isVetoUnlocked = true
            RoomsManager.toggleVeto('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
    })

    describe('addVetoVote', () => {
        test('should be able to add president vote into votes ', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT]
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            
            RoomsManager.addVetoVote('testRoom', 'ala')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
        test('should be able to add chancellor vote into votes ', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR]
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            
            RoomsManager.addVetoVote('testRoom', 'ala')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
        test('should be able to add chancellor and president votes into votes ', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'ala')

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'ola')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should be able to add president and chancellor votes into votes ', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_PRESIDENT, PlayerRole.ROLE_CHANCELLOR]

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'ola')

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'ala')

            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should not add more than 2 votes ever', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.vetoVotes = [PlayerRole.ROLE_CHANCELLOR, PlayerRole.ROLE_PRESIDENT]

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'ala')
            RoomsManager.addVetoVote('testRoom', 'ela')

            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'iza')
            RoomsManager.addVetoVote('testRoom', 'aza')

            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('non-president and non-chancellor cannot vote for veto', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.vetoVotes = []

            RoomsManager.getPlayerRole = () => null
            RoomsManager.addVetoVote('testRoom', 'ala')
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PREVIOUS_CHANCELLOR
            RoomsManager.addVetoVote('testRoom', 'iza')
            RoomsManager.getPlayerRole = () => PlayerRole.ROLE_PREVIOUS_PRESIDENT
            RoomsManager.addVetoVote('testRoom', 'ola')

            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
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
                RoomsManager.rooms_props['testRoom'].playersDict = generatePlayersDict(playersCount)
                const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
                initialRoomProps.boardType = expectedBoardSize
                RoomsManager.setPlayerboardType('testRoom')
                expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
            })
        })
    })
    describe('getPlayerboardType', () => {
        test('should retrieve the boardType from rooms_props', () => {
            const roomProps = RoomsManager.rooms_props
            roomProps['testRoom'].boardType = PlayerBoards.SmallBoard

            expect(RoomsManager.getPlayerboardType('testRoom')).toEqual(PlayerBoards.SmallBoard)
        })
    })
    describe('chooseNextPresident', () => {
        test('should choose next new president (normal flow, 3 players)', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {}
            RoomsManager.rooms_props['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 1,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: null,
                slotNumber: 2,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 3)', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {}
            RoomsManager.rooms_props['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.playersDict.player1.role = null
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 3 -> 1, should use modulo)', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {}
            RoomsManager.rooms_props['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: null,
                slotNumber: 1,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 2,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            initialRoomProps.playersDict.player2.role = null
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 1 -> 3, should ommit dead)', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {}
            RoomsManager.rooms_props['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 1,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: null,
                isDead: true,
                slotNumber: 2,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player2.role = null
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should choose next new president (normal flow, 3 players, 2 -> 1, should ommit dead and use modulo)', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {}
            RoomsManager.rooms_props['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                isDead: true,
                slotNumber: 3,
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PRESIDENT
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player3.role = null
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should choose next new president (special flow, 4 players, 1 -> 2 -> 2 (and 2nd was special president))', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {}
            RoomsManager.rooms_props['testRoom'].previousPresidentNameBackup = 'player1'
            RoomsManager.rooms_props['testRoom'].playersDict.player1 = {
                playerName: 'player1',
                role: PlayerRole.ROLE_PREVIOUS_PRESIDENT,
                slotNumber: 1,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player2 = {
                playerName: 'player2',
                role: PlayerRole.ROLE_PRESIDENT,
                slotNumber: 2,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player3 = {
                playerName: 'player3',
                role: null,
                slotNumber: 3,
            }
            RoomsManager.rooms_props['testRoom'].playersDict.player4 = {
                playerName: 'player4',
                role: null,
                isDead: true,
                slotNumber: 4,
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.playersDict.player1.role = null
            initialRoomProps.playersDict.player2.role = PlayerRole.ROLE_PRESIDENT
            initialRoomProps.playersDict.player3.role = null
            initialRoomProps.playersDict.player4.role = null
            initialRoomProps.previousPresidentNameBackup = null
            RoomsManager.chooseNextPresident('testRoom')
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
    })

    describe('startChancellorChoicePhase', () => {
        test('should set president backup and president if designatedPresidentName is passed', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {
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
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            RoomsManager.startChancellorChoicePhase('testRoom', 'player3')
            initialRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            initialRoomProps.previousPresidentNameBackup = 'player1'
            initialRoomProps.playersDict.player1.role = PlayerRole.ROLE_PREVIOUS_PRESIDENT
            initialRoomProps.playersDict.player3.role = PlayerRole.ROLE_PRESIDENT

            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })

        test('should call chooseNextPresident', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            RoomsManager.chooseNextPresident = jest.fn()
            RoomsManager.startChancellorChoicePhase('testRoom')
            initialRoomProps.gamePhase = GamePhases.GAME_PHASE_CHANCELLOR_CHOICE
            expect(RoomsManager.chooseNextPresident.mock.calls.length).toBe(1)
            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
    })

    describe('setPresidentBackup', () => {
        test('Should set president backup', () => {
            RoomsManager.rooms_props['testRoom'].playersDict = {
                player1: {
                    playerName: 'player1',
                    role: PlayerRole.ROLE_PRESIDENT,
                    slotNumber: 1,
                },
            }
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            RoomsManager.setPresidentBackup('testRoom')
            initialRoomProps.previousPresidentNameBackup = 'player1'

            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
    })

    describe('resetPresidentBackup', () => {
        test('Should reset president backup', () => {
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            RoomsManager.resetPresidentBackup('testRoom')
            initialRoomProps.previousPresidentNameBackup = null

            expect(initialRoomProps).toEqual(RoomsManager.rooms_props['testRoom'])
        })
    })

    describe('takeChoicePolicyCards', () => {
        const checkIfCardsMatch = (expectedCards, receivedCards) => {
            const expectedCardsGroupedCount = countBy(expectedCards)
            const receivedCardsGroupedCount = countBy(receivedCards)
            console.info(expectedCardsGroupedCount, receivedCardsGroupedCount)
            return (
                (expectedCardsGroupedCount[PolicyCards.FacistPolicy] === receivedCardsGroupedCount[PolicyCards.FacistPolicy])
                && (expectedCardsGroupedCount[PolicyCards.LiberalPolicy] === receivedCardsGroupedCount[PolicyCards.LiberalPolicy])
            )
        }
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
        test('Should take 1 out of 4 cards', () => {
            RoomsManager.rooms_props['testRoom'].drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            RoomsManager.rooms_props['testRoom'].discardPile = [PolicyCards.FacistPolicy]
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.drawPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            initialRoomProps.discardPile = [PolicyCards.FacistPolicy]
            initialRoomProps.drawnCards = [PolicyCards.FacistPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 1)
            
            expect(checkIfCardsMatch(
                [...initialRoomProps.drawPile, ...initialRoomProps.discardPile, ...initialRoomProps.drawnCards],
                [...RoomsManager.rooms_props['testRoom'].drawPile, ...RoomsManager.rooms_props['testRoom'].discardPile, ...RoomsManager.rooms_props['testRoom'].drawnCards]
            )).toEqual(true)
            expect(RoomsManager.rooms_props['testRoom']).toEqual(initialRoomProps)
        })
        test('Should take 2 out of 4 cards and shuffle the rest with discards', () => {
            RoomsManager.rooms_props['testRoom'].drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            RoomsManager.rooms_props['testRoom'].discardPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.drawPile = [PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            initialRoomProps.discardPile = []
            initialRoomProps.drawnCards = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 2)

            expect(checkIfCardsMatch(
                [...initialRoomProps.drawPile, ...initialRoomProps.discardPile, ...initialRoomProps.drawnCards],
                [...RoomsManager.rooms_props['testRoom'].drawPile, ...RoomsManager.rooms_props['testRoom'].discardPile, ...RoomsManager.rooms_props['testRoom'].drawnCards]
            )).toEqual(true)
            initialRoomProps.drawPile = RoomsManager.rooms_props['testRoom'].drawPile
            expect(RoomsManager.rooms_props['testRoom']).toEqual(initialRoomProps)
            expect(RoomsManager.rooms_props['testRoom'].drawPile.length).toEqual(5)
        })

        test('Should take 1 out of 1 cards and shuffle the rest with discards', () => {
            RoomsManager.rooms_props['testRoom'].drawPile = [PolicyCards.LiberalPolicy]
            RoomsManager.rooms_props['testRoom'].discardPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.drawPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            initialRoomProps.discardPile = []
            initialRoomProps.drawnCards = [PolicyCards.LiberalPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 1)

            expect(checkIfCardsMatch(
                [...initialRoomProps.drawPile, ...initialRoomProps.discardPile, ...initialRoomProps.drawnCards],
                [...RoomsManager.rooms_props['testRoom'].drawPile, ...RoomsManager.rooms_props['testRoom'].discardPile, ...RoomsManager.rooms_props['testRoom'].drawnCards]
            )).toEqual(true)
            initialRoomProps.drawPile = RoomsManager.rooms_props['testRoom'].drawPile
            expect(RoomsManager.rooms_props['testRoom']).toEqual(initialRoomProps)
            expect(RoomsManager.rooms_props['testRoom'].drawPile.length).toEqual(3)
        })

        test('Should take 1 out of 3 cards and shuffle the rest with discards', () => {
            RoomsManager.rooms_props['testRoom'].drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy]
            RoomsManager.rooms_props['testRoom'].discardPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            initialRoomProps.discardPile = []
            initialRoomProps.drawnCards = [PolicyCards.FacistPolicy]
            RoomsManager.takeChoicePolicyCards('testRoom', 1)

            initialRoomProps.drawPile = RoomsManager.rooms_props['testRoom'].drawPile
            expect(RoomsManager.rooms_props['testRoom']).toEqual(initialRoomProps)
            expect(RoomsManager.rooms_props['testRoom'].drawPile.length).toEqual(5)
        })
    })

    describe('peekPolicyCards', () => {
        test('Should return 3 cards but not modify anything', () => {
            RoomsManager.rooms_props['testRoom'].drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const initialRoomProps = cloneDeep(RoomsManager.rooms_props['testRoom'])
            const peekedCards = RoomsManager.peekPolicyCards('testRoom')

            expect(RoomsManager.rooms_props['testRoom']).toEqual(initialRoomProps)
            expect(peekedCards).toEqual([PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy])
        })
    })
})
