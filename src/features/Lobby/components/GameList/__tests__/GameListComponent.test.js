import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { aRoomsList } from 'packages/factories'
import { GameListComponent } from '../GameListComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        rooms: aRoomsList(null, { seed: 1 }),
        onClick: jest.fn(),
        ...propsOverrides,
    }
    const component = renderMethod(<GameListComponent {...props} />)
    return { props, component }
}

describe('<GameListComponent />', () => {
    it('matches snapshot - renders list of rooms', () => {
        const { props } = setupProps()
        expectShallowMatchingSnapshot(<GameListComponent {...props} />)
    })

    it('matches snapshot - doesnt render list of rooms if there are not any', () => {
        const { props } = setupProps({ rooms: {} })
        expectShallowMatchingSnapshot(<GameListComponent {...props} />)
    })
})
