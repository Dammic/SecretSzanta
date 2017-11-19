const RoomsManager = new (require('../RoomsManager'))()
const { GamePhases } = require('../../Dictionary')

describe('RoomsManager', () => {
    describe('initializeRoom', () => {
        test('should create room with owner', () => {
            RoomsManager.initializeRoom('testRoom', 'owner', 8)
            const roomProps = RoomsManager.rooms_props.testRoom
            expect(roomProps).toBeDefined()

            expect(roomProps).toEqual({
                ownerName: 'owner',
                freeSlots: [1, 2, 3, 4, 5, 6, 7, 8],
                playersDict: {},
                blackList: [],
                maxPlayers: 8,
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
})
