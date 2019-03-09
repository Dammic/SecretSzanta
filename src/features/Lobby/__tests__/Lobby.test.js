import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { Lobby } from '../Lobby'

describe('<Lobby />', () => {
    it('matches snapshot', () => {
        expectShallowMatchingSnapshot(<Lobby />)
    })
})
