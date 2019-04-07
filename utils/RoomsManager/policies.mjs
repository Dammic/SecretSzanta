import lodash from 'lodash'
import { roomsStore } from '../../stores'
import { logError } from '../../utils/utils'

const {
    filter,
    includes,
    shuffle,
    size,
    concat,
    take,
    takeRight,
    drop,
    pullAt,
    indexOf,
} = lodash

export const moveCard = (sourcePile, destinationPile, card) => {
    if (!includes(sourcePile, card)) {
        logError({}, `moveCard function: wanted to move card ${card} which don't exist in source pile`)
        return
    }
    pullAt(sourcePile, indexOf(sourcePile, card))
    destinationPile.push(card)
}

export const discardAllCards = (roomName) => {
    const room = roomsStore[roomName]
    room.discardPile = [...room.discardPile, ...room.drawnCards]
    room.drawnCards = []
}

export const enactPolicy = (roomName, card) => {
    const { drawnCards, policiesPile } = roomsStore[roomName]
    moveCard(drawnCards, policiesPile, card)
    discardAllCards(roomName)
}

export const discardPolicy = (roomName, card) => {
    const { drawnCards, discardPile } = roomsStore[roomName]
    moveCard(drawnCards, discardPile, card)
}

export const discardPolicyByVeto = (roomName) => {
    const { policiesPile, discardPile } = roomsStore[roomName]
    const discardedPolicy = takeRight(policiesPile, 1)[0]
    console.log(discardedPolicy)
    moveCard(policiesPile, discardPile, discardedPolicy)
}

export const getDrawnCards = (roomName) => {
    return roomsStore[roomName].drawnCards
}

export const reShuffle = (roomName) => {
    const room = roomsStore[roomName]

    room.drawPile = shuffle(concat(room.drawPile, room.discardPile))
    room.discardPile = []
}

export const takeChoicePolicyCards = (roomName, amount) => {
    const room = roomsStore[roomName]

    if (size(room.drawPile) < amount) reShuffle(roomName)

    const policies = take(room.drawPile, amount)
    room.drawPile = drop(room.drawPile, amount)
    room.drawnCards = policies

    if (size(room.drawPile) < 3) reShuffle(roomName)
    return policies
}

export const peekLastEnactedPolicyCard = (roomName) => {
    const { policiesPile } = roomsStore[roomName]
    return policiesPile[policiesPile.length - 1]
}

export const peekPolicyCards = (roomName) => {
    const { drawPile } = roomsStore[roomName]
    return take(drawPile, 3)
}

export const getPolicyCardsCount = (roomName, policyType) => {
    const { policiesPile } = roomsStore[roomName]
    return size(filter(policiesPile, policy => policy === policyType))
}
