import React from 'react'
import { shallow, mount } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import { SocketEvents } from '../../../../../../Dictionary'
import { socket } from '../../../../../utils/SocketHandler'
import { ChatForm } from '../ChatForm'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        userName: 'mockUsername',
        ...propsOverrides,
    }
    const component = renderMethod(<ChatForm {...props} />)
    return { props, component }
}

describe('<ChatForm />', () => {
    it('sendMessage sends socket event and resets typed message', () => {
        const { props, component } = setupProps()
        const instance = component.instance()
        const mockMessageContent = 'mockMessage'

        const expectedSocketParams = [
            SocketEvents.CLIENT_SEND_MESSAGE,
            {
                author: props.userName,
                content: mockMessageContent,
            },
        ]

        component.setState({ typedMessage: mockMessageContent })
        instance.sendMessage()
        expect(socket.emit).toHaveBeenCalledWith(...expectedSocketParams)
        expect(instance.state.typedMessage).toEqual('')
    })

    it('sendMessage is called when user presses enter on input', () => {
        const { component } = setupProps(null, mount)
        const messageInput = component.find('input')
        const instance = component.instance()
        instance.sendMessage = jest.fn()

        messageInput.simulate('keyPress', {
            keyCode: 13,
            which: 13,
            key: 'Enter',
        })

        expect(instance.sendMessage).toHaveBeenCalled()

        instance.sendMessage = jest.fn()
        messageInput.simulate('keyPress', {
            keyCode: 65,
            which: 65,
            key: 'a',
        })
        expect(instance.sendMessage).not.toHaveBeenCalled()
    })
})
