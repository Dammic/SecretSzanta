import faker from 'faker'
import { times } from 'lodash'

export const arrayOf = (callback, amount, options = { seed: null }) => {
    if (options.seed) {
        faker.seed(options.seed)
    }

    const result = []
    times(amount, () => result.push(callback()))
    return result
}
