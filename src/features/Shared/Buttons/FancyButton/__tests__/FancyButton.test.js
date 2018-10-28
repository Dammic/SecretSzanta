import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import FancyButton from '../FancyButton'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        children: <span>mockLabel</span>,
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<FancyButton {...props} />)
    return { props, component }
}

describe('<FancyButton />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<FancyButton {...props} />)
    })
})
