'use strict'
import React from 'react'
import PlayerComponent from './PlayerComponent'

export default class Player extends React.PureComponent {

    render() {

        const {playerName} = this.props.player

        
        const random = Math.floor(Math.random() * 5 + 1)

        const pictureRandom = require(`../../../static/Avatar${random}.png`)
        const rolePicture = require('../../../static/Chancellor.png')

        return (
                <PlayerComponent 
                    playerName = {playerName}
                    avatar = {pictureRandom}
                    rolePicture = {rolePicture}
                />
               )
    }

}

