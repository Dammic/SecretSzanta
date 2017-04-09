'use strict'
import React from 'react'
import _random from 'lodash/random'
import PlayerComponent from './PlayerComponent'
import {PlayerDirection} from '../../../const/PlayerConsts'
import {PlayerRole} from '../../../const/PlayerConsts'

export default class Player extends React.PureComponent {

    render() {

        const {playerName, role} = this.props.player

        const random = _random(0, 5)

        const pictureRandom = require(`../../../static/Avatar${random}.png`)
        
        const getBubbleStyle = (direction) => {
            switch(direction) {
                case PlayerDirection.PLAYER_DIRECTION_LEFT:
                    return 'left'
                case PlayerDirection.PLAYER_DIRECTION_RIGHT:
                    return 'right'
                default:
                    return 'down'
            }

        }

        const rolePicture = (role) => {
            switch(role) {
                case PlayerRole.ROLE_CHANCELLOR:
                    return require('../../../static/Chancellor.png')
                
                case PlayerRole.ROLE_PRESIDENT:
                    return require('../../../static/President.png')
                
                case PlayerRole.ROLE_PREVIOUS_CHANCELLOR:
                    return require('../../../static/PreviousChancelor.png')

                case PlayerRole.ROLE_PREVIOUS_PRESIDENT:
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

