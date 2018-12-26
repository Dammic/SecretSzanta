import React from 'react'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { NoResults } from '../NoResults'

describe('<NoResults />', () => {
    it('matches snapshot', () => {
        expectShallowMatchingSnapshot(<NoResults />)
    })
})
