const RoomsManager = new (require('../RoomsManager'))()
const { GamePhases } = require('../../Dictionary')

describe('RoomsManager', () => {
    beforeEach(() => {
        RoomsManager.initializeRoom('testRoom')
        RoomsManager.players = {}
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
})
