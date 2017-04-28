'use strict'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LoginPageComponent from './LoginPageComponent'
import GameRoom from '../GameRoom/GameRoom'
import GameList from '../GameList/GameList'
import {selectName} from '../../ducks/userDuck'

export class LoginPage extends React.PureComponent {

    constructor (props) {
        super(props)
        this.inputRef = null
    }

    setInputRef = (inpRef) => {
        this.inputRef = inpRef
    }

    /**
     * Function that handles enter press
     */
    onInputChange = (event) => {
        if (event.key === 'Enter') {
            this.setName()
        }
    }

    setName = () => {
        const name = this.inputRef.value
        const {selectName} = this.props.actions
        selectName(name)
    }

    render () {
        const {userName} = this.props
        if (userName === '') {
            return (
                <div>
                    <LoginPageComponent onSetNameClick={this.setName} setInputRef={this.setInputRef} onInputChange={this.onInputChange}/>
                </div>
            )
        } else {
            return <GameList userName={userName}/>
        }
    }

}

const mapStateToProps = ({user}) => {
    return {
        userName: user.userName
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({selectName}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
