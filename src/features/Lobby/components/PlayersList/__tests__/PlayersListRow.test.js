import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { PlayersListRow } from '../PlayersListRow'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        playerName: 'mockPlayerName',
        avatarNumber: 1,
        currentRoom: 'mockCurrentRoom',
        ...propsOverrides,
    }
    const component = renderMethod(<PlayersListRow {...props} />)
    return { props, component }
}

describe('<PlayersListRow />', () => {
    it('matches snapshot - renders user with current room', () => {
        const { props } = setupProps()
        expectShallowMatchingSnapshot(<PlayersListRow {...props} />)
    })

    it('matches snapshot - renders user without current room', () => {
        const { props } = setupProps({ currentRoom: null })
        expectShallowMatchingSnapshot(<PlayersListRow {...props} />)
    })
})
