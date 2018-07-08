import React from 'react'
import { shallow } from 'enzyme'
import { aMessage, arrayOf } from 'packages/factories'
import { expectMatchingSnapshot } from 'packages/testUtils'
import { MessagesBox } from '../MessagesBox'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        messages: arrayOf(aMessage, 3, { seed: 1 }),
        ...propsOverrides,
    }
    const component = renderMethod(<MessagesBox { ...props } />)
    return { props, component }
}

describe('<MessagesBox />', () => {
    it('calls scrollToBottomOfMessages on each update', () => {
        const { props, component } = setupProps()
        const instance = component.instance();
        instance.scrollToBottomOfMessages = jest.fn()
        component.setProps({ messages: [...props.messages, aMessage()] })
        expect(instance.scrollToBottomOfMessages).toHaveBeenCalled()
    })
})
