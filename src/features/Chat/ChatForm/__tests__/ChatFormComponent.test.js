import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import ChatFormComponent from '../ChatFormComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        sendMessage: jest.fn(),
        typedMessage: 'mockMessage',
        changeMessageText: jest.fn(),
        handleFormKeyPress: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<ChatFormComponent { ...props } />)
    return { props, component }
}

describe('<ChatFormComponent />', () => {
    it('matches snapshot', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<ChatFormComponent {...props} />)
    })
})
