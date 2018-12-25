import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { PlayerRole as PlayerRoleDict } from '../../../../../Dictionary'
import { PlayerAvatar } from '../PlayerAvatar'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        liberalAvatar: 1,
        fascistAvatar: null,
        isDead: false,
        isPlayerWaitedFor: false,
        isOwner: false,
        className: 'mockClassName',
        role: PlayerRoleDict.ROLE_CHANCELLOR,
        ...propsOverrides,
    }
    const component = renderMethod(<PlayerAvatar {...props} />)
    return { props, component }
}

describe('<PlayerAvatar />', () => {
    it('returns null if liberalAvatarPicture doesnt exist', () => {
        const { props } = setupProps({ liberalAvatar: 999 })
        expectShallowMatchingSnapshot(<PlayerAvatar {...props} />)
    })

    it('shows liberal avatar, fascist avatar, owner icon, waited for icon, dead classname and role ribbon for full data', () => {
        const { props } = setupProps({ fascistAvatar: 21, isDead: true, isPlayerWaitedFor: true, isOwner: true })
        expectShallowMatchingSnapshot(<PlayerAvatar {...props} />)
    })

    it('doesnt show fascist avatar, owner icon, waited for icon, dead classname for minimum data', () => {
        const { props } = setupProps({ fascistAvatar: null, isDead: false, isPlayerWaitedFor: false, isOwner: false })
        expectShallowMatchingSnapshot(<PlayerAvatar {...props} />)
    })

    it('doesnt show role ribbon if user is dead', () => {
        const { props } = setupProps({ isDead: true })
        expectShallowMatchingSnapshot(<PlayerAvatar {...props} />)
    })
})
