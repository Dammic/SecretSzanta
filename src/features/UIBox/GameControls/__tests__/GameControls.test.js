import React from 'react'
import { shallow } from 'enzyme'
import { GameControls } from '../GameControls'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        gamePhase: null,
        toggleAffiliationMenu: jest.fn(),
        isOwner: false,
        isAffiliationHidden: false,
        ...propsOverrides,
    }
    const component = renderMethod(<GameControls {...props} />)
    return { props, component }
}

describe('<GameControls />', () => {
    describe('toggleShow', () => {
        it('works and calls proper action', () => {
            const { component, props } = setupProps()
            const instance = component.instance()
            instance.toggleShow()
            expect(props.toggleAffiliationMenu).toHaveBeenCalled()
        })
    })
})
