import { cloneDeep, size, times, countBy } from 'lodash'
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
import { getAllRooms, getRoom } from '../../../stores'

// TODO: functions that are not tested:
// getDrawnCards,
// discardPolicyByVeto,
// discardAllCards,
// enactPolicy,
// getPolicyCardsCount,
// peekLastEnactedPolicyCard
// helper function checkIfRoomsCardsMatch

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
    })
    afterEach(() => {
        // this tests if the function did not override different room than it should
        expect(size(getAllRooms())).toEqual(1)
    })

    describe('reShuffle', () => {
        test('The same cards stay after reShuffle', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy]
            testRoom.discardPile = [PolicyCards.LiberalPolicy]
            const preparedRoom = cloneDeep(testRoom)
            reShuffle('testRoom')
            expect(testRoom.discardPile).toEqual([])
            expect(checkIfCardsMatch(
                testRoom.drawPile,
                [...preparedRoom.drawPile, ...preparedRoom.discardPile],
            )).toEqual(true)
        })
    })

    describe('discardPolicy', () => {
        test(`If no card is passed then it reports error, any pile isn't changed`, () => {
            const testRoom = getRoom('testRoom')
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
            const testRoom = getRoom('testRoom')
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
            const testRoom = getRoom('testRoom')
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
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [PolicyCards.LiberalPolicy]
            testRoom.discardPile = []
            moveCard(testRoom.drawPile, testRoom.discardPile, testRoom.drawPile[0])
            expect(testRoom.drawPile).toEqual([])
            expect(testRoom.discardPile).toEqual([PolicyCards.LiberalPolicy])
        })

        test('Non-existing policy in source pile is not moved to other pile', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = []
            testRoom.discardPile = []
            moveCard(testRoom.drawPile, testRoom.discardPile, PolicyCards.LiberalPolicy)
            expect(testRoom.drawPile).toEqual([])
            expect(testRoom.discardPile).toEqual([])
        })

        test('Only chosen policy is moved to another pile', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [PolicyCards.LiberalPolicy, PolicyCards.FacistPolicy]
            testRoom.discardPile = []
            const cardToStay = testRoom.drawPile[1]
            moveCard(testRoom.drawPile, testRoom.discardPile, testRoom.drawPile[0])
            expect(testRoom.drawPile).toEqual([cardToStay])
            expect(testRoom.discardPile).toEqual([PolicyCards.LiberalPolicy])
        })
    })

    describe('takeChoicePolicyCards', () => {
        test('Should take 1 out of 4 cards', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            testRoom.discardPile = [PolicyCards.FacistPolicy]
            const preparedRoomProps = cloneDeep(testRoom)
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
                testRoom,
            )).toEqual(true)

            expect(testRoom).toEqual(preparedRoomProps)
        })

        test('Should take 2 out of 4 cards and shuffle the rest with discards', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            testRoom.discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const preparedRoomProps = cloneDeep(testRoom)
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
                testRoom,
            )).toEqual(true)

            preparedRoomProps.drawPile = testRoom.drawPile
            expect(testRoom).toEqual(preparedRoomProps)
            expect(testRoom.drawPile.length).toEqual(5)
        })

        test('Should take 1 out of 1 cards and shuffle the rest with discards', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [PolicyCards.LiberalPolicy]
            testRoom.discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const preparedRoomProps = cloneDeep(testRoom)
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
                testRoom,
            )).toEqual(true)

            preparedRoomProps.drawPile = testRoom.drawPile
            expect(testRoom).toEqual(preparedRoomProps)
            expect(testRoom.drawPile.length).toEqual(3)
        })

        test('Should take 1 out of 3 cards and shuffle the rest with discards', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
            ]
            testRoom.discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const preparedRoomProps = cloneDeep(testRoom)
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
                testRoom,
            )).toEqual(true)

            preparedRoomProps.drawPile = testRoom.drawPile
            expect(testRoom).toEqual(preparedRoomProps)
            expect(testRoom.drawPile.length).toEqual(5)
        })
        test('Should take 3 cards, but first shuffle, because there is only one available on draw pile', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [
                PolicyCards.FacistPolicy,
            ]
            testRoom.discardPile = [
                PolicyCards.FacistPolicy,
                PolicyCards.LiberalPolicy,
            ]
            const preparedRoomProps = cloneDeep(testRoom)

            takeChoicePolicyCards('testRoom', 3)

            expect(checkIfRoomsCardsMatch(
                preparedRoomProps,
                testRoom,
            )).toEqual(true)
            expect(checkIfCardsMatch(
                [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy],
                testRoom.drawnCards,
            )).toEqual(true)
        })
    })

    describe('peekPolicyCards', () => {
        test('Should return 3 cards but not modify anything', () => {
            const testRoom = getRoom('testRoom')
            testRoom.drawPile = [PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy, PolicyCards.LiberalPolicy]
            const preparedRoomProps = cloneDeep(testRoom)
            const peekedCards = peekPolicyCards('testRoom')

            expect(testRoom).toEqual(preparedRoomProps)
            expect(peekedCards).toEqual([PolicyCards.FacistPolicy, PolicyCards.FacistPolicy, PolicyCards.LiberalPolicy])
        })
    })
})
