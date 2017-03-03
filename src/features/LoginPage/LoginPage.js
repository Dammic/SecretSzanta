'use strict'
import React from 'react'
import LoginPageComponent from './LoginPageComponent'
import {testMock} from '../../const/testMock'
import MainPage from "../MainPage/MainPage"
import GameList from "../GameList/GameList"

export default class LoginPage extends React.PureComponent {

    constructor(props){
        super(props)
        this.state = {
            "name": "Login"
        }
    }
    // componentWillMount() {
    //     this.state = {
    //         "name": "Login"
    //     }
    //
    // }
    render () {
        const fakeTitle = 'traveler'
        const {name} = this.state;

            if (name === "Login") {
                return <LoginPageComponent onSetNameClick={this.setName.bind(this)}/>
            }
            else if (name === "RoomList"){
                console.log("here")
                return <GameList/>
            }

    }

    setName () {
        console.log("pressed")
        this.setState({
            "name": "RoomList"
        });
        console.log("processed")
    }
}
