import React from 'react'
import { shallow } from 'enzyme'
import { TopNavbar } from '../TopNavbar'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        userName: 'mockUserName',
        setModal: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<TopNavbar {...props} />)
    return { props, component }
}

describe('<TopNavbar />', () => {
    describe('onShowModal', () => {
        it('it calls setModal with proper parameters', () => {
            const { props, component } = setupProps()
            const instance = component.instance()

            instance.onShowModal()

            const expectedParams = {
                title: 'Create new game',
                isCloseButtonShown: true,
                isOverlayOpaque: true,
                componentName: 'CreateGameModal',
            }

            expect(props.setModal).toHaveBeenCalledWith(expectedParams)
        })
    })
})
