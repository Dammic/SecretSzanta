import faker from 'faker'
import moment from 'moment'

export const aMessage = (propsOverrides, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    return {
        time: moment(faker.date.recent()).format('HH:mm'),
        author: faker.internet.userName(),
        content: faker.random.words(),
        ...propsOverrides,
    }
}
