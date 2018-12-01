import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingShallowSnapshot } from 'packages/testUtils'
import PlayerComponent from '../PlayerComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        playerName: 'mockPlayerName',
        bubbleDirection: 'mockBubbleDirection',
        liberalAvatar: 1,
        facistAvatar: 2,
        role: 'mockRole',
        isSelectable: false,
        onClick: jest.fn(),
        isChoiceModeVisible: false,
        isDead: false,
        isPlayerWaitedFor: false,
        isOwner: false,
        ...propsOverrides,
    }
    const component = renderMethod(<PlayerComponent {...props} />)
    return { props, component }
}

describe('<PlayerComponent />', () => {
    it('', () => {
        const { props } = setupProps({ liberalAvatar: 999 })
        expectMatchingShallowSnapshot(<PlayerComponent {...props} />)
    })

})
