import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import PrimaryButton from '../PrimaryButton'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        children: <span>mockLabel</span>,
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<PrimaryButton {...props} />)
    return { props, component }
}

describe('<PrimaryButton />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<PrimaryButton {...props} />)
    })
})
