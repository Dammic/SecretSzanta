import lodash from 'lodash'
import { getRoom, updateRoom } from '../../stores'
import { logError } from '../../utils/utils'

const {
    filter,
    includes,
    shuffle,
    size,
    take,
    indexOf,
    drop
} = lodash

export const moveCard = (roomName, sourcePileName, destinationPileName, card) => {
    const room = getRoom(roomName)
    const sourcePile = room[sourcePileName]
    const destinationPile = room[destinationPileName]

    if (!includes(sourcePile, card)) {
        logError({}, `moveCard function: wanted to move card ${card} which don't exist in source pile`)
        return
    }
    const firstOccurenceOfCard = indexOf(sourcePile, card)
    updateRoom(roomName, {
        [sourcePileName]: [
            ...sourcePile.slice(0, firstOccurenceOfCard),
            ...sourcePile.slice(firstOccurenceOfCard + 1),
        ],
        [destinationPileName]: [...destinationPile, card],
    })
}

export const discardAllCards = (roomName) => {
    const { discardPile, drawnCards } = getRoom(roomName)
    updateRoom(roomName, {
        discardPile: [...discardPile, ...drawnCards],
        drawnCards: [],
    })
}

export const enactPolicy = (roomName, card) => {
    moveCard(roomName, 'drawnCards', 'policiesPile', card)
    discardAllCards(roomName)
}

export const discardPolicy = (roomName, card) => {
    moveCard(roomName, 'drawnCards', 'discardPile', card)
}

export const discardPolicyByVeto = (roomName) => {
    const { policiesPile } = getRoom(roomName)
    const discardedPolicy = take(policiesPile, 1)[0]
    moveCard(roomName, 'policiesPile', 'discardPile', discardedPolicy)
}

export const getDrawnCards = (roomName) => {
    return getRoom(roomName).drawnCards
}

export const reShuffle = (roomName) => {
    const { drawPile, discardPile } = getRoom(roomName)

    updateRoom(roomName, {
        drawPile: shuffle([...drawPile, ...discardPile]),
        discardPile: [],
    })
}

export const takeChoicePolicyCards = (roomName, amount) => {
    if (size(getRoom(roomName).drawPile) < amount) reShuffle(roomName)

    const { drawPile } = getRoom(roomName)
    const policies = take(drawPile, amount)
    const newDrawPile = drop(drawPile, amount)
    updateRoom(roomName, {
        drawPile: newDrawPile,
        drawnCards: policies,
    })

    if (size(newDrawPile) < 3) reShuffle(roomName)
    return policies
}

export const peekLastEnactedPolicyCard = (roomName) => {
    const { policiesPile } = getRoom(roomName)
    return policiesPile[policiesPile.length - 1]
}

export const peekPolicyCards = (roomName) => {
    const { drawPile } = getRoom(roomName)
    return take(drawPile, 3)
}

export const getPolicyCardsCount = (roomName, policyType) => {
    const { policiesPile } = getRoom(roomName)
    return size(filter(policiesPile, policy => policy === policyType))
}
