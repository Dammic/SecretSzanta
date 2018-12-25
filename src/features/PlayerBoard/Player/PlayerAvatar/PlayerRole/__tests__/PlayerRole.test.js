import React from 'react'
import { shallow } from 'enzyme'
import { forEach } from 'lodash'
import { expectMatchingSnapshot } from 'packages/testUtils'
import { PlayerRole as PlayerRoleDict } from '../../../../../../Dictionary'
import PlayerRole from '../PlayerRole'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        role: null,
        className: 'mockClassName',
        ...propsOverrides,
    }
    const component = renderMethod(<PlayerRole {...props} />)
    return { props, component }
}

describe('<PlayerRole />', () => {
    it('returns null if role is not defined', () => {
        const { props } = setupProps({ role: null })
        expectMatchingSnapshot(<PlayerRole {...props} />)
    })

    it('returns null if role is incorrect', () => {
        const { props } = setupProps({ role: 'someincorrectrole' })
        expectMatchingSnapshot(<PlayerRole {...props} />)
    })

    it('returns proper images if role is one of correct roles', () => {
        const correctRoles = [
            PlayerRoleDict.ROLE_CHANCELLOR,
            PlayerRoleDict.ROLE_PRESIDENT,
            PlayerRoleDict.ROLE_PREVIOUS_CHANCELLOR,
            PlayerRoleDict.ROLE_PREVIOUS_PRESIDENT,
        ]
        forEach(correctRoles, (role) => {
            const { props } = setupProps({ role })
            expectMatchingSnapshot(<PlayerRole {...props} />)
        })
    })
})
