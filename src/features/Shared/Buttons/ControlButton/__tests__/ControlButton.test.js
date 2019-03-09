import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import ControlButton from '../ControlButton'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        children: <span>mockLabel</span>,
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<ControlButton {...props} />)
    return { props, component }
}

describe('<ControlButton />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<ControlButton {...props} />)
    })
})
