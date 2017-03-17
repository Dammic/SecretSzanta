'use strict'
import React from 'react'
import PlayerBoardComponent from './PlayerBoardComponent'

export default class PlayerBoard extends React.PureComponent {
    
    constructor(props) {
        super(props)
        
        var players = ['krokodyl',
                       'pies',
                       'zyrafa',
                       'zaba',
                       'lis',
                       'kot',
                       'tygrys',
                       'hipopotam'
                       ].map(
                               name => this.makePlayer(name)
                            )
            
        var left = []
        var center = []
        var right = []

        for( var i = 0; i < players.length; i++) {
            if (i % 3 == 0) left.push(players[i])
            else if (i % 3 == 1) right.push(players[i])
            else center.push(players[i])
        }
        this.state = {
            playersLeft: left,
            playersMiddle: center,
            playersRight: right
        }
        
    }

    makePlayer(name) {
        return {
            playerName: name,
            picture: require('../../static/portrait1.png')
        }
    }

    render () {
        return (
            <PlayerBoardComponent 
                //left={['krokodyl', 'pies', 'zyrafa'].map( name => this.makePlayer(name) )} 
                //middle = {['zaba', 'lis'].map( name => this.makePlayer(name) )} 
                //right={['kot', 'tygrys', 'hipopotam'].map( name => this.makePlayer(name) )} 
                left = {this.state.playersLeft}
                middle = {this.state.playersMiddle}
                right = {this.state.playersRight}
                
            />
        )
    }
}
