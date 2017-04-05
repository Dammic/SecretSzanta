'use strict'
import React from 'react'
import PlayerBoardComponent from './PlayerBoardComponent'

export default class PlayerBoard extends React.PureComponent {

    makePlayer(name) {
        return {
            playerName: name,
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
        //players later will be given via props
        const players = mockPlayers.map(   
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

        return (
            <PlayerBoardComponent 
                playersLeft = {left} 
                playersMiddle = {center}
                playersRight = {right}
                policiesLiberalCount = {5}
                policiesFacistCount = {6}
            />
        )
    }
}
