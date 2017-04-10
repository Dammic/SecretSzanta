'use strict'
import React from 'react'
import LoginPageComponent from './LoginPageComponent'
import GameRoom from '../GameRoom/GameRoom'
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

    /**
     * Function that handles enter press
     */
    onInputChange = (event) => {
        if (event.key === 'Enter') {
            this.setName()
        }
    }

    setName = () => {
        const name = this.inputRef.value

        this.setState({
            userName: name
        })
    }

    render () {
        const {userName=''} = this.state
        if (userName === '') {
            return (
                <div>
                    <LoginPageComponent onSetNameClick={this.setName} setInputRef={this.setInputRef} onInputChange={this.onInputChange}/>
                </div>
            )
        } else {
            return <GameList userName={userName}/>
        }
    }

}
