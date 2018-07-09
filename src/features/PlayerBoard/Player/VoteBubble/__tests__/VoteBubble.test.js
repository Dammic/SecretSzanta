import React from 'react'
import { shallow } from 'enzyme'
import { VoteBubble } from '../VoteBubble'
import { expectMatchingSnapshot } from '/packages/testUtils'
import { PlayerDirection, GamePhases } from '../../../../../../Dictionary'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        playerName: 'mockPlayerName',
        direction: null,
        votes: { mockPlayerName: '' },
        gamePhase: null,
        ...propsOverrides,
    }
    const component = renderMethod(<VoteBubble {...props} />)
    return { props, component }
}

describe('<VoteBubble />', () => {
    it('renders active top bubble', () => {
        const { props } = setupProps({
            votes: { mockPlayerName: true },
            gamePhase: GamePhases.GAME_PHASE_VOTING,
        })

        expectMatchingSnapshot(<VoteBubble {...props} />)
    })
    it('does not render bubble at all if player has not voted (his voting value is undefined)', () => {
        const { props } = setupProps({
            votes: { mockPlayerName: undefined },
        })

        expectMatchingSnapshot(<VoteBubble {...props} />)
    })

    describe('isBubbleActive', () => {
        it('returns false if game phase is not defined and player has not voted', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: undefined },
                gamePhase: null,
            })
            const instance = component.instance()
            expect(instance.isBubbleActive()).toEqual(false)
        })

        it('returns false if game phase is not voting and player has not voted', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: undefined },
                gamePhase: 'someothergamephase',
            })
            const instance = component.instance()
            expect(instance.isBubbleActive()).toEqual(false)
        })

        it('returns false if game phase is voting and player has not voted', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: undefined },
                gamePhase: GamePhases.GAME_PHASE_VOTING,
            })
            const instance = component.instance()
            expect(instance.isBubbleActive()).toEqual(false)
        })

        it('returns true if game phase is voting and player has voted (either true or false)', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: true },
                gamePhase: GamePhases.GAME_PHASE_VOTING,
            })
            const instance = component.instance()
            expect(instance.isBubbleActive()).toEqual(true)

            component.setProps({ votes: { mockPlayerName: false } })
            expect(instance.isBubbleActive()).toEqual(true)
        })
    })

    describe('getVoteBubbleStyle', () => {
        describe('left', () => {
            it('renders inactive bubble', () => {
                const { component } = setupProps({
                    direction: PlayerDirection.PLAYER_DIRECTION_LEFT,
                })
                const instance = component.instance()
                instance.isBubbleActive = () => false
                const receivedClassName = instance.getVoteBubbleStyle()
                expect(receivedClassName).toEqual('bubble bubbleLeft')
            })

            it('renders active bubble', () => {
                const { component } = setupProps({
                    direction: PlayerDirection.PLAYER_DIRECTION_LEFT,
                })
                const instance = component.instance()
                instance.isBubbleActive = () => true
                const receivedClassName = instance.getVoteBubbleStyle()
                expect(receivedClassName).toEqual('bubble bubbleLeft active')
            })
        })

        describe('right', () => {
            it('renders inactive bubble', () => {
                const { component } = setupProps({
                    direction: PlayerDirection.PLAYER_DIRECTION_RIGHT,
                })
                const instance = component.instance()
                instance.isBubbleActive = () => false
                const receivedClassName = instance.getVoteBubbleStyle()
                expect(receivedClassName).toEqual('bubble bubbleRight')
            })

            it('renders active bubble', () => {
                const { component } = setupProps({
                    direction: PlayerDirection.PLAYER_DIRECTION_RIGHT,
                })
                const instance = component.instance()
                instance.isBubbleActive = () => true
                const receivedClassName = instance.getVoteBubbleStyle()
                expect(receivedClassName).toEqual('bubble bubbleRight active')
            })
        })

        describe('top', () => {
            it('renders inactive bubble', () => {
                const { component } = setupProps({
                    direction: PlayerDirection.PLAYER_DIRECTION_TOP,
                })
                const instance = component.instance()
                instance.isBubbleActive = () => false
                const receivedClassName = instance.getVoteBubbleStyle()
                expect(receivedClassName).toEqual('bubble bubbleTop')
            })

            it('renders active bubble', () => {
                const { component } = setupProps({
                    direction: PlayerDirection.PLAYER_DIRECTION_TOP,
                })
                const instance = component.instance()
                instance.isBubbleActive = () => true
                const receivedClassName = instance.getVoteBubbleStyle()
                expect(receivedClassName).toEqual('bubble bubbleTop active')
            })
        })
    })

    describe('getVoteValue', () => {
        it('returns undefined if vote is undefined or empty string if user has voted but it has not been revealed', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: undefined },
                playerName: 'mockPlayerName',
            })
            const instance = component.instance()
            expect(instance.getVoteValue()).toEqual(undefined)
            component.setProps({ votes: { mockPlayerName: '' } })
            expect(instance.getVoteValue()).toEqual('')
        })

        it('returns JA if user voted for yes', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: true },
                playerName: 'mockPlayerName',
            })
            const instance = component.instance()
            expect(instance.getVoteValue()).toEqual('JA')
        })

        it('returns NEIN if user voted for yes', () => {
            const { component } = setupProps({
                votes: { mockPlayerName: false },
                playerName: 'mockPlayerName',
            })
            const instance = component.instance()
            expect(instance.getVoteValue()).toEqual('NEIN')
        })
    })
})
