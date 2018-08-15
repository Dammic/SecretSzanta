import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import Icon from '../Icon'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        name: 'mockName',
        onClick: jest.fn(),
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<Icon {...props} />)
    return { props, component }
}

describe('<Icon />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<Icon {...props} />)
    })
})
