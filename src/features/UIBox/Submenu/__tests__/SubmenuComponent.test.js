import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { PlayerAffilications } from '../../../../../Dictionary'
import SubmenuComponent from '../SubmenuComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        isAffiliationHidden: true,
        affiliation: null,
        role: null,
        liberalAvatar: 1,
        fascistAvatar: 1,
        isOwner: false,
        isDead: false,
        ...propsOverrides,
    }
    const component = renderMethod(<SubmenuComponent {...props} />)
    return { props, component }
}

describe('<SubmenuComponent />', () => {
    it('matches snapshot, rendering hidden affiliation menu and liberal classname', () => {
        const { props } = setupProps({})
        expectShallowMatchingSnapshot(<SubmenuComponent {...props} />)
    })

    it('matches snapshot, rendering visible affiliation menu and fascist classname', () => {
        const { props } = setupProps({ isAffiliationHidden: false, affiliation: PlayerAffilications.FACIST_AFFILIATION })
        expectShallowMatchingSnapshot(<SubmenuComponent {...props} />)
    })
})
