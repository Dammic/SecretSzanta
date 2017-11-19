import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TimerComponent from './TimerComponent'
import { setWaitTime } from '../../ducks/roomDuck'

export class Timer extends React.PureComponent {
    static propTypes = {

    }
    state = {
        secondsRemaining: 0,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.waitTime !== nextProps.waitTime && nextProps.waitTime ) {
            this.setState({ secondsRemaining: nextProps.waitTime })
            this.interval = setInterval(this.tick, 1000)
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    tick = () => {
        this.setState({ secondsRemaining: this.state.secondsRemaining - 1 })
        if (this.state.secondsRemaining <= 0) {
            this.props.setWaitTime(0)
            clearInterval(this.interval)
        }
    }

    render() {
        return (
            <TimerComponent
                secondsRemaining={this.state.secondsRemaining}
            />
        )
    }
}

const mapStateToProps = ({ room }) => ({
    waitTime: room.waitTime,
})

const mapDispatchToProps = dispatch => ({
    setWaitTime: payload => dispatch(setWaitTime(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
