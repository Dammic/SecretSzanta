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
            "userName": ''
        }
    }

    setInputRef(inpRef){
        this.inputRef = inpRef
    }

    setName () {
        console.log('pressed')
        var name = this.inputRef.value

        this.setState({
            "userName": name
        })
        console.log('processed')
    }

    render () {
        const {userName=''} = this.state

        if (userName === '') {
            return <LoginPageComponent onSetNameClick={this.setName.bind(this)} setInputRef={this.setInputRef.bind(this)}/>
        } else {
            console.log('here')
            return <GameList userName={userName}/>
        }
    }

}
