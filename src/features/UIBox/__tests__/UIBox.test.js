import React from 'react'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import UIBox from '../UIBox'

describe('<UIBox />', () => {
    it('matches snapshot', () => {
        expectShallowMatchingSnapshot(<UIBox />)
    })
})
