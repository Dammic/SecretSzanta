import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import Button from '../Button'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        children: <span>mockLabel</span>,
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<Button {...props} />)
    return { props, component }
}

describe('<Button />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<Button {...props} />)
    })
})
