import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { SocketEvents } from '../../../Dictionary'
import TimerComponent from './TimerComponent'
import { setWaitTime, setVeto } from '../../ducks/roomDuck'
import { socket } from '../../utils/SocketHandler'

export class Timer extends React.PureComponent {
    static displayName = 'Timer'
    static propTypes = {
        setVeto: PropTypes.func,
        setWaitTime: PropTypes.func,
        waitTime: PropTypes.number,
        isVetoUnlocked: PropTypes.bool,
    }
    state = {
        secondsRemaining: 0,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.waitTime !== nextProps.waitTime && nextProps.waitTime) {
            this.setState({ secondsRemaining: nextProps.waitTime / 1000 })
            clearInterval(this.interval)
            this.interval = setInterval(this.tick, 1000)
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    onVetoClick = () => {
        socket.emit(SocketEvents.VetoVoteRegistered)
        this.props.setVeto({ value: false })
    }

    tick = () => {
        this.setState({ secondsRemaining: this.state.secondsRemaining - 1 })
        if (this.state.secondsRemaining <= 0) {
            this.props.setWaitTime(0)
            clearInterval(this.interval)
        }
    }

    render() {
        const { isVetoUnlocked } = this.props
        return (
            <TimerComponent
                secondsRemaining={this.state.secondsRemaining}
                isVetoUnlocked={isVetoUnlocked}
                onVetoClick={this.onVetoClick}
            />
        )
    }
}

const mapStateToProps = ({ room }) => ({
    waitTime: room.waitTime,
    isVetoUnlocked: room.isVetoUnlocked,
})

const mapDispatchToProps = dispatch => ({
    setWaitTime: payload => dispatch(setWaitTime(payload)),
    setVeto: payload => dispatch(setVeto(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
