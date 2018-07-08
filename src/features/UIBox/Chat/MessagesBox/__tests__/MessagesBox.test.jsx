import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from '../../../../../utils/testUtils'
import { MessagesBox } from '../MessagesBox'
import { aMessage, arrayOf } from '../../../../../utils/factories'

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
