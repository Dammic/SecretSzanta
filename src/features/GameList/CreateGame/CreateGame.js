'use strict'
import React from 'react'
import CreateGameModal from './CreateGameModal'
export default class CreateGame extends React.PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            isModalShown: false
        }
    }

    showModal = () => {
        this.setState({isModalShown: true})
    }

    hideModal = () => {
        this.setState({isModalShown: false})
    }

    render () {
        const {socket} = this.props
        return (
            <div>
                <div className="top-bar">
                    <button onClick={this.showModal}>Create Game</button>
                </div>
                <CreateGameModal showModal={this.state.isModalShown} onHide={this.hideModal} onCreate={this.hideModal} socket={socket}/>
            </div>
        )
    }
}
