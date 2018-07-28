import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import { GamePhases } from '../../../../../Dictionary'
import GameControlsComponent from '../GameControlsComponent'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        onStartVote: jest.fn(),
        onStartGame: jest.fn(),
        onKickPlayer: jest.fn(),
        onBanPlayer: jest.fn(),
        onShowAffiliationClick: jest.fn(),
        isOwner: false,
        gamePhase: null,
        isAffiliationHidden: false,
        ...propsOverrides,
    }
    const component = renderMethod(<GameControlsComponent {...props} />)
    return { props, component }
}

describe('<GameControlsComponent />', () => {
    it('renders right arrow if affiliation menu is hidden, and no owner buttons is user is not the owner (and no start game button either)', () => {
        const { props } = setupProps({ isAffiliationHidden: true, isOwner: false })
        expectMatchingSnapshot(<GameControlsComponent {...props} />)
    })

    it('renders left arrow if affiliation menu is shown,', () => {
        const { props } = setupProps({ isAffiliationHidden: false, isOwner: true })
        expectMatchingSnapshot(<GameControlsComponent {...props} />)
    })

    it('shows additional start button if game is at new phase and user is an owner', () => {
        const { props } = setupProps({
            isAffiliationHidden: true,
            isOwner: true,
            gamePhase: GamePhases.GAME_PHASE_NEW,
        })
        expectMatchingSnapshot(<GameControlsComponent {...props} />)
    })
})
