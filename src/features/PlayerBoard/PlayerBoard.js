'use strict'
import React from 'react'
import PlayerBoardComponent from './PlayerBoardComponent'

export default class PlayerBoard extends React.PureComponent {
    
    constructor(props) {
        super(props)
        this.state = {
            policies: 0
        }

        this.TestTimer = setInterval(() => {
            this.setState({
                policies: this.state.policies + 1
            })
        }, 1000)
    }

    makePlayer(name) {
       
        const role = Math.floor(Math.random() * 3 + 3)

        return {
            playerName: name,
            role: role
        }
    }

    render () {
         const mockPlayers = ['krokodyl',
               'pies',
               'zyrafa',
               'zaba',
               'lis',
               'kot',
               'tygrys',
               'hipopotam',
               'niedzwiedz'
                   ];
                   
        //const players = mockPlayers.map(   
        //    name => this.makePlayer(name)
        //)

        const players = this.props.players.map(
            name => this.makePlayer(name)
        )

        let left = []
        let center = []
        let right = []


        players.map((player, index) => {
            if (index % 3 == 0) left.push(player)
            else if (index % 3 == 1) right.push(player)
            else center.push(player)
        })

        if (this.state.policies > 4) {
            clearInterval(this.TestTimer)
        }

        return (
            <PlayerBoardComponent 
                playersLeft = {left} 
                playersMiddle = {center}
                playersRight = {right}
                policiesLiberalCount = {this.state.policies}
                policiesFacistCount = {this.state.policies+1}
            />
        )
    }
}
