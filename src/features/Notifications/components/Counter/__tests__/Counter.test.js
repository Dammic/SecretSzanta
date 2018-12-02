
import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot, asyncWait } from 'packages/testUtils'
import { Counter } from '../Counter'

jest.useFakeTimers()

describe('<Counter />', () => {
    it('matches snapshot at beginning of countdown', () => {
        expectShallowMatchingSnapshot(<Counter start={2} />)
    })

    it('counts down to 0', async () => {
        const component = shallow(<Counter start={5} />)
        jest.runAllTimers()
        await asyncWait()
        expect(clearInterval).toHaveBeenCalledTimes(1)
        expect(component.state('counter')).toEqual(null)
    })
})
