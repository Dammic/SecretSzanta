'use strict'
import React from 'react'
import UIBoxComponent from './UIBoxComponent'

export default class UIBox extends React.PureComponent {

    render () {
        const {socket} = this.props
        return (
            <UIBoxComponent socket={socket} userName={this.props.userName}/>
        )
    }
}
