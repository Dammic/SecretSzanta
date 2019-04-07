import React from 'react'
import { mount } from 'enzyme'
import { aRoomsList } from 'packages/factories'
import { SocketEvents } from '../../../../../../Dictionary'
import { socket } from '../../../../../utils/SocketHandler'
import { ControlButton } from '../../../../Shared/Buttons'
import { GameList } from '../GameList'

const setupProps = (propsOverrides = {}, renderMethod = mount) => {
    const props = {
        rooms: aRoomsList(),
        setRoom: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<GameList {...props} />)
    return { props, component }
}

describe('<GameList />', () => {
    describe('setRoomName', () => {
        it('is emits a proper event when clicking on the first elements join button', () => {
            const { props, component } = setupProps()
            const firstRoomName = Object.keys(props.rooms)[0]

            const expectedSocketParams = [
                SocketEvents.CLIENT_JOIN_ROOM,
                {
                    password: '',
                    roomName: props.rooms[firstRoomName].roomId,
                },
            ]

            component.find(ControlButton).first().simulate('click')

            expect(socket.emit).toHaveBeenCalledWith(...expectedSocketParams)
        })
    })
})
