'use strict'
import React from 'react'
import PlayerBoardComponent from './PlayerBoardComponent'

export default class PlayerBoard extends React.PureComponent {

    render () {
        return (
            <PlayerBoardComponent 
                left={['krokodyl', 'pies', 'zyrafa']} 
                middle = {['zaba', 'lis']} 
                right={['kot', 'tygrys', 'hipopotam']} 
            />
        )
    }
}
