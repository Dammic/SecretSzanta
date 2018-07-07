import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from '../../../../../utils/testUtils'
import MessagesBoxComponent from '../MessagesBoxComponent'
import { aMessage, arrayOf } from '../../../../../utils/factories'

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
        const props = setupProps()
        expectMatchingSnapshot(<MessagesBoxComponent {...props} />)
    })

    it('renders no messages if no messages have been passed', () => {
        const props = setupProps({ messages: null })
        expectMatchingSnapshot(<MessagesBoxComponent {...props} />)
    })

    it('calls setMessagesBoxRef function on render', () => {
        const { props } = setupProps()
        expect(props.setMessagesBoxRef).toHaveBeenCalled()
    })
})
