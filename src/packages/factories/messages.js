import faker from 'faker'
import moment from 'moment'

export const aMessage = (propsOverrides, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    const randomHour = faker.random.number({ min: 0, max: 23 })
    const randomMinutes = `0${faker.random.number({ min: 0, max: 59 })}`.slice(-2)
    return {
        time: `${randomHour}:${randomMinutes}`,
        author: faker.internet.userName(),
        content: faker.random.words(),
        ...propsOverrides,
    }
}
