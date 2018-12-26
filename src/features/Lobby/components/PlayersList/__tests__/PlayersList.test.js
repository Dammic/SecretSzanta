import React from 'react'
import { shallow } from 'enzyme'
import { expectShallowMatchingSnapshot } from 'packages/testUtils'
import { aPlayersList, aPlayer } from 'packages/factories'
import { PlayersList } from '../PlayersList'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const mockPlayersList = aPlayersList(null, { seed: 2 })
    const mockPlayerWithoutRoom = aPlayer({ currentRoom: null }, { seed: 1 })
    mockPlayersList[mockPlayerWithoutRoom.playerName] = mockPlayerWithoutRoom
    console.log(mockPlayerWithoutRoom)
    console.log(mockPlayersList)
    const props = {
        playersList: mockPlayersList,
        ...propsOverrides,
    }
    const component = renderMethod(<PlayersList {...props} />)
    return { props, component }
}

describe('<PlayersList />', () => {
    it('matches snapshot - renders list of 4 players with the ones having a  room at the top', () => {
        const { props } = setupProps()
        expectShallowMatchingSnapshot(<PlayersList {...props} />)
    })
})
