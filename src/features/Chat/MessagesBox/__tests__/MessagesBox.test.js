import React from 'react'
import { shallow } from 'enzyme'
import { aMessage, arrayOf } from 'packages/factories'
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
    it('calls scrollToBottomOfMessages on each update if user has scrolled to bottom already', () => {
        const { props, component } = setupProps()
        const instance = component.instance()
        instance.scrollToBottomOfMessages = jest.fn()
        instance.messagesBoxRef = {
            current: {
                scrollHeight: 200,
                offsetHeight: 100,
                scrollTop: 78,
            },
        }
        component.setProps({ messages: [...props.messages, aMessage()] })
        expect(instance.scrollToBottomOfMessages).toHaveBeenCalled()
    })

    it('doesnt call scrollToBottomOfMessages if user has not scrolled to the bottom of chat', () => {
        const { props, component } = setupProps()
        const instance = component.instance()
        instance.scrollToBottomOfMessages = jest.fn()
        instance.messagesBoxRef = {
            current: {
                scrollHeight: 200,
                offsetHeight: 100,
                scrollTop: 30,
            },
        }
        component.setProps({ messages: [...props.messages, aMessage()] })
        expect(instance.scrollToBottomOfMessages).not.toHaveBeenCalled()
    })
})
