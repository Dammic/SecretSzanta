import { aRoom } from 'packages/factories'
import { expectMatchingSnapshot } from 'packages/testUtils'
import React from 'react'
import { mount } from 'enzyme'
import { ControlButton } from '../../../../../../Shared/Buttons'

import { RoomCell } from '../RoomCell'

const setupProps = (propsOverrides = {}, renderMethod = mount) => {
    const props = {
        room: aRoom(),
        onJoin: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<RoomCell {...props} />)
    return { props, component }
}

describe('<RoomCell />', () => {
    it('displays password input after attept to join secured room', () => {
        const { props, component } = setupProps({ room: aRoom({ hasPassword: true }) })

        component.find(ControlButton).first().simulate('click')

        component.update()
        expect(component.find('input').exists()).toEqual(true)
    })

    describe('calls onJoin callback when room', () => {
        it('has no password', () => {
            const { props: { onJoin }, component } = setupProps()

            component.find(ControlButton).first().simulate('click')

            expect(onJoin).toHaveBeenCalled()
        })

        it('has password, it is called with password passed', () => {
            const testRoom = aRoom({ hasPassword: true });
            const password = 'somePassword';

            const { props: { onJoin }, component } = setupProps({ room: testRoom })

            component.find(ControlButton).first().simulate('click')

            component.update()
            component.find('input').simulate('change', { target: { value: password } })

            component.find(ControlButton).first().simulate('click')
            expect(onJoin).toHaveBeenCalledWith(testRoom.roomId, password)
        })
    })

    it('should match snippet when romm has password', () => {
        const { props } = setupProps({ room: aRoom({ hasPassword: true }, { seed: 1 }) })

        expectMatchingSnapshot(<RoomCell {...props} />)
    })

    it('should match snippet when romm doesn\'t have password', () => {
        const { props } = setupProps({ room: aRoom({ hasPassword: false }, { seed: 1 }) })

        expectMatchingSnapshot(<RoomCell {...props} />)
    })
})
