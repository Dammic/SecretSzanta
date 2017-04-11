'use strict'
import React from 'react'
import _random from 'lodash/random'
import PlayerComponent from './PlayerComponent'
import {PlayerDirection} from '../../../const/PlayerConsts'
import {PlayerRole} from '../../../const/PlayerConsts'

export default class Player extends React.PureComponent {

    render() {

        const {playerName, role, avatar, isBubbleActive} = this.props.player
        
        const avatarPicture = require(`../../../static/Avatar${avatar}.png`) 

        const getBubbleStyle = () => {
            
            const bubbleActiveStyle = isBubbleActive ? ' active' : '' 
                
            switch(this.props.direction) {
                case PlayerDirection.PLAYER_DIRECTION_LEFT:
                    return 'bubble-left' + bubbleActiveStyle
                case PlayerDirection.PLAYER_DIRECTION_RIGHT:
                    return 'bubble-right' + bubbleActiveStyle
                default:
                    return 'bubble-top' + bubbleActiveStyle
            }

        }

        const getRolePicture = () => {
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
                avatar = {avatarPicture}
                rolePicture = {getRolePicture()}
                bubbleStyle = {getBubbleStyle()}
            />
        )
    }

}

