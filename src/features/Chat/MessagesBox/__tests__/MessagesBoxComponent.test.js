import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import { aMessage, arrayOf } from 'packages/factories'
import MessagesBoxComponent from '../MessagesBoxComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        setMessagesBoxRef: jest.fn(),
        messages: arrayOf(aMessage, 3, { seed: 1 }),
        ...propsOverrides,
    }
    const component = renderMethod(<MessagesBoxComponent { ...props } />)
    return { props, component }
}

describe('<MessagesBoxComponent />', () => {
    it('renders 3 messages if there are any passed', () => {
        const { props } = setupProps()
        expectMatchingSnapshot(<MessagesBoxComponent {...props} />)
    })

    it('renders server messages', () => {
        const { props } = setupProps({
            messages: [...arrayOf(aMessage, 2, { seed: 1 }), aMessage({ author: null }, { seed: 1 })],
        })
        expectMatchingSnapshot(<MessagesBoxComponent {...props} />)
    })

    it('renders no messages if no messages have been passed', () => {
        const { props } = setupProps({ messages: null })
        expectMatchingSnapshot(<MessagesBoxComponent {...props} />)
    })
})
