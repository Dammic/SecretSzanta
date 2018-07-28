import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import Chat from '../Chat'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        userName: 'mockUserName',
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<Chat { ...props } />)
    return { props, component }
}

describe('<Chat />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectShallowMatchingSnapshot(<Chat {...props} />)
    })
})
