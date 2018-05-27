import lodash from 'lodash'
import {
    reShuffle,
    getDrawnCards,
    discardPolicyByVeto,
    discardAllCards,
    discardPolicy,
    enactPolicy,
    moveCard,
    takeChoicePolicyCards,
    getPolicyCardsCount,
    peekPolicyCards,
} from '../policies'
import { initializeRoom } from '../rooms'

import { PolicyCards } from '../../../Dictionary'
import { roomsStore } from '../../../stores'

const { cloneDeep, size, times, countBy } = lodash

// TODO: functions that are not tested:
// getDrawnCards,
// discardPolicyByVeto,
// discardAllCards,
// enactPolicy,
// getPolicyCardsCount,

const checkIfCardsMatch = (expectedCards, receivedCards) => {
    const expectedCardsGroupedCount = countBy(expectedCards)
    const receivedCardsGroupedCount = countBy(receivedCards)
    return (
        (expectedCardsGroupedCount[PolicyCards.FacistPolicy] === receivedCardsGroupedCount[PolicyCards.FacistPolicy])
        && (expectedCardsGroupedCount[PolicyCards.LiberalPolicy] === receivedCardsGroupedCount[PolicyCards.LiberalPolicy])
    )
}

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

describe('helper function checkIfCardsMatch', () => {
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

describe('policies', () => {
    beforeEach(() => {
        initializeRoom('testRoom')
    });
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(roomsStore)).toEqual(1)
    });

    describe('reShuffle', () => {
        test('The same cards stay after reShuffle', () => {
            const room = roomsStore['testRoom']
            room.drawPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy]
            room.discardPile = [PolicyCards.LiberalPolicy]
            const preparedRoom = cloneDeep(room)
            reShuffle('testRoom')
            expect(room.discardPile).toEqual([])
            expect(checkIfCardsMatch(
                room.drawPile,
                [...preparedRoom.drawPile, ...preparedRoom.discardPile],
            )).toEqual(true)
        })
    })

    describe('discardPolicy', () => {
        test(`If no card is passed then it reports error, any pile isn't changed`, () => {
            const { testRoom } = roomsStore
            testRoom.drawPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            const preparedRoomProps = cloneDeep(testRoom)

            discardPolicy('testRoom', undefined)
            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                testRoom,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                preparedRoomProps.drawPile,
                testRoom.drawPile,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                preparedRoomProps.discardPile,
                testRoom.discardPile,
            )).toEqual(true)
        })

        test('Should move chosen card from drawn cards pile to discard pile', () => {
            const testRoom = roomsStore.testRoom
            testRoom.drawPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
                ...times(2, () => PolicyCards.LiberalPolicy),
            ]
            const preparedRoomProps = cloneDeep(testRoom)

            discardPolicy('testRoom', testRoom.drawPile[3])
            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                testRoom,
            )).toEqual(true)
        })

        test('If card does not exist in draw pile, then error is reported and any pile is not changed', () => {
            const { testRoom } = roomsStore
            testRoom.drawPile = [
                ...times(3, () => PolicyCards.FacistPolicy),
            ]
            const notPresentCard = PolicyCards.LiberalPolicy
            const preparedRoomProps = cloneDeep(testRoom)

            discardPolicy('testRoom', notPresentCard)

            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                testRoom,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                preparedRoomProps.drawPile,
                testRoom.drawPile,
            )).toEqual(true)

            expect(checkIfCardsMatch(
                preparedRoomProps.discardPile,
                testRoom.discardPile,
            )).toEqual(true)
        })
    })

    describe('moveCard', () => {
        test('Policy card is removed from drawn card pile and added to discard pile', () => {
            const room = roomsStore['testRoom']
            room.drawPile = [PolicyCards.LiberalPolicy]
            room.discardPile = []
            moveCard(room.drawPile, room.discardPile, room.drawPile[0])
            expect(room.drawPile).toEqual([])
            expect(room.discardPile).toEqual([PolicyCards.LiberalPolicy])
        })

        test('Non-existing policy in source pile is not moved to other pile', () => {
            const room = roomsStore['testRoom']
            room.drawPile = []
            room.discardPile = []
            moveCard(room.drawPile, room.discardPile, PolicyCards.LiberalPolicy)
            expect(room.drawPile).toEqual([])
            expect(room.discardPile).toEqual([])
        })

        test('Only chosen policy is moved to another pile', () => {
            const room = roomsStore['testRoom']
            room.drawPile = [PolicyCards.LiberalPolicy, PolicyCards.FacistPolicy]
            room.discardPile = []
            const cardToStay = room.drawPile[1]
            moveCard(room.drawPile, room.discardPile, room.drawPile[0])
            expect(room.drawPile).toEqual([cardToStay])
            expect(room.discardPile).toEqual([PolicyCards.LiberalPolicy])
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
            const preparedRoomProps = cloneDeep(roomsStore['testRoom'])
            preparedRoomProps.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            preparedRoomProps.discardPile = [PolicyCards.FacistPolicy]
            preparedRoomProps.drawnCards = [PolicyCards.FacistPolicy]
            takeChoicePolicyCards('testRoom', 1)
            
            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            expect(roomsStore['testRoom']).toEqual(preparedRoomProps)
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
            const preparedRoomProps = cloneDeep(roomsStore['testRoom'])
            preparedRoomProps.drawPile = [
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            preparedRoomProps.discardPile = []
            preparedRoomProps.drawnCards = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy]
            takeChoicePolicyCards('testRoom', 2)

            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            preparedRoomProps.drawPile = roomsStore['testRoom'].drawPile
            expect(roomsStore['testRoom']).toEqual(preparedRoomProps)
            expect(roomsStore['testRoom'].drawPile.length).toEqual(5)
        })

        test('Should take 1 out of 1 cards and shuffle the rest with discards', () => {
            roomsStore['testRoom'].drawPile = [PolicyCards.LiberalPolicy]
            roomsStore['testRoom'].discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const preparedRoomProps = cloneDeep(roomsStore['testRoom'])
            preparedRoomProps.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            preparedRoomProps.discardPile = []
            preparedRoomProps.drawnCards = [PolicyCards.LiberalPolicy]
            takeChoicePolicyCards('testRoom', 1)

            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            preparedRoomProps.drawPile = roomsStore['testRoom'].drawPile
            expect(roomsStore['testRoom']).toEqual(preparedRoomProps)
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
            const preparedRoomProps = cloneDeep(roomsStore['testRoom'])
            preparedRoomProps.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            preparedRoomProps.discardPile = []
            preparedRoomProps.drawnCards = [PolicyCards.FacistPolicy]
            takeChoicePolicyCards('testRoom', 1)

            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)

            preparedRoomProps.drawPile = roomsStore['testRoom'].drawPile
            expect(roomsStore['testRoom']).toEqual(preparedRoomProps)
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
            const preparedRoomProps = cloneDeep(roomsStore['testRoom'])

            takeChoicePolicyCards('testRoom', 3)

            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                roomsStore['testRoom'],
            )).toEqual(true)
            expect(checkIfCardsMatch(
                [ PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy ],
                roomsStore['testRoom'].drawnCards,
            )).toEqual(true)
        })
    })

    describe('peekPolicyCards', () => {
        test('Should return 3 cards but not modify anything', () => {
            roomsStore['testRoom'].drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const preparedRoomProps = cloneDeep(roomsStore['testRoom'])
            const peekedCards = peekPolicyCards('testRoom')

            expect(roomsStore['testRoom']).toEqual(preparedRoomProps)
            expect(peekedCards).toEqual([PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy])
        })
    })

});
