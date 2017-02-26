'use strict'
require('../../styles/main.scss')
import React from 'react'
import MainPageComponent from './MainPageComponent'
import {testMock} from '../../const/testMock'

export default class MainPage extends React.PureComponent {
    render () {
        const fakeTitle = 'traveler'
        return (
            <MainPageComponent title={fakeTitle} userNames={testMock} />
        )
    }
}
