import React from 'react'
import { mount } from 'enzyme'
import { aRoomsList } from 'packages/factories'
import { SocketEvents } from '../../../../../../Dictionary'
import { socket } from '../../../../../utils/SocketHandler'
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
            const firstRoom = Object.keys(props.rooms)[0];

            const expectedSocketParams = [
                SocketEvents.SocketEvents.CLIENT_JOIN_ROOM,
                {
                    roomName: firstRoom.roomName
                },
            ]

            component.find('button').first().simulate('click')

            expect(socket.emit).toHaveBeenCalledWith(...expectedSocketParams)
        })
    })
})
