import React from 'react'
import { shallow } from 'enzyme'
import { socket } from '../../../utils/SocketHandler'
import { SocketEvents } from '../../../../Dictionary'
import { Timer } from '../Timer'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        setVeto: jest.fn(),
        setWaitTime: jest.fn(),
        waitTime: 0,
        isVetoUnlocked: false,
        ...propsOverrides,
    }
    const component = renderMethod(<Timer {...props} />)
    return { props, component }
}

describe('<Timer />', () => {
    it('clears interval when unmounting', () => {
        const { component } = setupProps()
        const clearIntervalMock = jest.spyOn(window, 'clearInterval').mockImplementationOnce(jest.fn())

        component.unmount()
        expect(clearIntervalMock).toHaveBeenCalled()
    })

    it('sets interval when waitTime is set', () => {
        const { component } = setupProps()
        const instance = component.instance()
        const setIntervalMock = jest.spyOn(window, 'setInterval').mockImplementationOnce(jest.fn())
        const clearIntervalMock = jest.spyOn(window, 'clearInterval').mockImplementationOnce(jest.fn())

        component.setProps({ waitTime: 10000 })
        expect(instance.state.secondsRemaining).toEqual(10)
        expect(clearIntervalMock).toHaveBeenCalled()
        expect(setIntervalMock).toHaveBeenCalledWith(instance.tick, 1000)
    })

    describe('onVetoClick', () => {
        it('works and calls proper actions', () => {
            const { component, props } = setupProps()
            const instance = component.instance()
            instance.onVetoClick()
            expect(socket.emit).toHaveBeenCalledWith(SocketEvents.VetoVoteRegistered)
            expect(props.setVeto).toHaveBeenCalledWith({ value: false })
        })
    })

    describe('tick', () => {
        it('decreases remaining seconds if they are > 0', () => {
            const { component } = setupProps()
            const instance = component.instance()
            instance.setState({ secondsRemaining: 10 })
            instance.tick()
            expect(instance.state.secondsRemaining).toEqual(9)
        })

        it('clears interval and calls proper action if secondsRemaining <= 0', () => {
            const { component, props } = setupProps()
            const instance = component.instance()
            const clearIntervalMock = jest.spyOn(window, 'clearInterval').mockImplementationOnce(jest.fn())
            instance.setState({ secondsRemaining: 1 })

            instance.tick()
            expect(instance.state.secondsRemaining).toEqual(0)
            expect(props.setWaitTime).toHaveBeenCalledWith(0)
            expect(clearIntervalMock).toHaveBeenCalled()
        })
    })
})
