import React from 'react'
import { trim } from 'lodash';
import classNames from 'classnames/bind'
import styles from './Notifications.css'

export class StatusNotification extends React.PureComponent {
    state = { counter: null }

    countDown = () => {
        console.log('new counter', this.state.counter)
        this.setState(
            prevState => {
                const newValue = prevState.counter - 1
                return {
                    counter: newValue <= 0 ? null : newValue,
                }
            },
        )
    }

    static getDerivedStateFromProps(props, state) {
        if (props.id === state.prevId) return state;

        const counter = props.additional ? props.additional.counterStart : null

        return {
            prevId: props.id,
            counter,
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.countDown, 1000)
    }

    render() {
        const { message, additional } = this.props

        function replaceWithComponent(what, WithWhat) {
            const regex = /(%\*?(.*)\*?%)/g;
            const matched = message.match(regex)
            const reslt = message.split(regex).reduce((final, el, index) => {
                if (el === '%counter%') {
                    final.push(<span>dupadupadupa</span>);
                } else if (el[1] === '*') {
                    final.push(<b>{trim(el, '%*')}</b>);
                } else {
                    final.push(<span>el</span>); 
                }
                // final.push (
                //     <WithWhat value={matched[index - 1]}/>, <span> {el}</span>
                // )
            }, [])
            reslt[0] = <span>reslt[0]</span>;
            return reslt;
        }


        return (
            <div className={classNames(styles.notificationPanel, styles.status)} >
                {message}
                {this.state.counter >= 0 &&
                    <span className={styles.counter} >
                        {this.state.counter}
                    </span>
                }
            </div>
        )
    }
}
