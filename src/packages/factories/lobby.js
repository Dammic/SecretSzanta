import faker from 'faker'
import { keyBy } from 'lodash'
import { arrayOf } from './arrayOf'

export const aRoom = (propsOverrides, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    return {
        roomName: faker.random.words(),
        playerCount: faker.random.number({ min: 0, max: 10 }),
        roomId: faker.random.word(),
        ...propsOverrides,
    }
}

export const aRoomsList = (propsOverrides, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    return keyBy(arrayOf(aRoom, 3, options), 'roomId')
}

export const aPlayer = (propsOverrides, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    return {
        playerName: faker.internet.userName(),
        avatarNumber: faker.random.number({ min: 1, max: 6 }),
        currentRoom: faker.random.word(),
        ...propsOverrides,
    }
}

export const aPlayersList = (propsOverrides, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    return keyBy(arrayOf(aPlayer, 3, options), 'playerName')
}
