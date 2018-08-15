import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import TimerComponent from '../TimerComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        secondsRemaining: 0,
        isVetoUnlocked: false,
        onVetoClick: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<TimerComponent {...props} />)
    return { props, component }
}

describe('<TimerComponent />', () => {
    it('timer is hidden when there are no seconds remaining and veto button is not rendered', () => {
        const { props } = setupProps({ secondsRemaining: 0, isVetoUnlocked: false })
        expectMatchingSnapshot(<TimerComponent {...props} />)
    })

    it('shows timer when there are remaining seconds and veto button is not rendered', () => {
        const { props } = setupProps({ secondsRemaining: 10, isVetoUnlocked: false })
        expectMatchingSnapshot(<TimerComponent {...props} />)
    })

    it('shows timer when there are remaining seconds and veto button is rendered if there is veto possibility', () => {
        const { props } = setupProps({ secondsRemaining: 10, isVetoUnlocked: true })
        expectMatchingSnapshot(<TimerComponent {...props} />)
    })
})
