import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import PlayerAvatar from '../PlayerAvatar'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        liberalAvatar: 1,
        fascistAvatar: null,
        isDead: false,
        isPlayerWaitedFor: false,
        isOwner: false,
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<PlayerAvatar {...props} />)
    return { props, component }
}

describe('<PlayerAvatar />', () => {
    it('returns null if liberalAvatarPicture doesnt exist', () => {
        const { props } = setupProps({ liberalAvatar: 999 })
        expectMatchingSnapshot(<PlayerAvatar {...props} />)
    })

    it('shows liberal avatar, fascist avatar, owner icon, waited for icon, dead classname for full data', () => {
        const { props } = setupProps({ fascistAvatar: 21, isDead: true, isPlayerWaitedFor: true, isOwner: true })
        expectMatchingSnapshot(<PlayerAvatar {...props} />)
    })

    it('doesnt show fascist avatar, owner icon, waited for icon, dead classname for minimum data', () => {
        const { props } = setupProps({ fascistAvatar: null, isDead: false, isPlayerWaitedFor: false, isOwner: false })
        expectMatchingSnapshot(<PlayerAvatar {...props} />)
    })
})
