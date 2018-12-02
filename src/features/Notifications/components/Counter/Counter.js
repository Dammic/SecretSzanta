import React from 'react'
import PropTypes from 'prop-types'
import styles from './Counter.css'

export class Counter extends React.PureComponent {
    static displayName = 'Counter'
    static propTypes = {
        start: PropTypes.number,
    }

    state = { counter: this.props.start }

    componentDidMount() {
        this.interval = setInterval(this.countDown, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    countDown = () => {
        this.setState((prevState) => {
            const newCounter = prevState.counter - 1

            if (newCounter <= 0) {
                clearInterval(this.interval)
                return { counter: null }
            }

            return { counter: newCounter }
        })
    }

    render() {
        return (
            <span className={styles.counter}>
                {this.state.counter}sec
            </span>
        )
    }
}
