import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { TopNavbarComponent } from '../TopNavbarComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        userName: 'mockUserName',
        onShowModal: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<TopNavbarComponent {...props} />)
    return { props, component }
}

describe('<TopNavbarComponent />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectShallowMatchingSnapshot(<TopNavbarComponent {...props} />)
    })
})
