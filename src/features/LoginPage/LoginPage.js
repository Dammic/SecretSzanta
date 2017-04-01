'use strict'
import React from 'react'
import LoginPageComponent from './LoginPageComponent'
import MainPage from '../MainPage/MainPage'
import GameList from '../GameList/GameList'

export default class LoginPage extends React.PureComponent {

    constructor (props) {
        super(props)
        this.inputRef = null
        this.state = {
            userName: ''
        }
    }

    setInputRef = (inpRef) => {
        this.inputRef = inpRef
    }

    setName = () => {
        const name = this.inputRef.value

        this.setState({
            "userName": name
        })
    }

    render () {
        const {userName=''} = this.state
        if (userName === '') {
            return <LoginPageComponent onSetNameClick={this.setName} setInputRef={this.setInputRef}/>
        } else {
            return <GameList userName={userName}/>
        }
    }

}
