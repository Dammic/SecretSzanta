'use strict'
import React from 'react'
import CreateGameButtonComponent from './CreateGameButtonComponent'
import CreateGameModal from './CreateGameModal'


export default class CreateGame extends React.PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            showModal: false
        }
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
    }

    showModal(){
        this.setState({showModal: true})
    }

    hideModal(){
        this.setState({showModal: false})
    }

    render () {
        const {socket} = this.props
        return (
            <div>
                <CreateGameButtonComponent onClick={this.showModal}/>
                <CreateGameModal showModal={this.state.showModal} onHide={this.hideModal} onCreate={this.hideModal} socket={socket}/>
            </div>
        )
    }
}
