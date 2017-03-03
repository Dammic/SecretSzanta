'use strict'
import React from 'react'
import GameListComponent from './GameListComponent'
import {testMock} from '../../const/testMock'

export default class GameList extends React.PureComponent {
    render () {
        const fakeTitle = 'traveler'

        return (
            <GameListComponent title={fakeTitle} userNames={testMock} />
        )
    }
}
