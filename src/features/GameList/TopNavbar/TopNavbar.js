'use strict'
import React from 'react'
import TopNavbarComponent from './TopNavbarComponent'

export default class TopNavbar extends React.PureComponent {

    constructor () {
        super()
        this.state = {
            isModalShown: false
        }
    }

    hideModal = () => {
        this.setState({isModalShown: false})
    }

    showModal = () => {
        this.setState({isModalShown: true})
    }

    render () {
        return <TopNavbarComponent
            showModal={this.showModal}
            isModalShown={this.state.isModalShown}
            onHide={this.hideModal}
            onCreate={this.hideModal}
        />
    }
}
