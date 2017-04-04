'use strict'
import React from 'react'
import PlayerComponent from './PlayerComponent'

export default class Player extends React.PureComponent {

    render() {

        const {playerName, role} = this.props.player

        const random = Math.floor(Math.random() * 5 + 1)

        const pictureRandom = require(`../../../static/Avatar${random}.png`)
        
        const rolePicture = (role) => {
            switch(role) {
                case 1:
                    return require('../../../static/Chancellor.png')
                
                case 2:
                    return require('../../../static/President.png')
                
                case 3:
                    return require('../../../static/PreviousChancelor.png')

                case 4:
                    return require('../../../static/PreviousPresident.png')

                default:
                    return null
            }
        }

        return (
            <PlayerComponent 
                playerName = {playerName}
                avatar = {pictureRandom}
                rolePicture = {rolePicture(role)}
            />
        )
    }

}

