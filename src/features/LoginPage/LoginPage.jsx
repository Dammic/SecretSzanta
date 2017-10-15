import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import LoginPageComponent from './LoginPageComponent'
import GameRoom from '../GameRoom/GameRoom'
import GameList from '../GameList/GameList'
import { selectName } from '../../ducks/userDuck'

export class LoginPage extends React.PureComponent {
    static propTypes = {
        // redux
        userActions: PropTypes.objectOf(PropTypes.func),
        userName: PropTypes.string,
    }

    constructor(props) {
        super(props)
        this.inputRef = null
    }

    /**
     * Function that handles enter press
     */
    onInputChange = (event) => {
        if (event.key === 'Enter') {
            this.setName()
        }
    }

    setInputRef = (inpRef) => {
        this.inputRef = inpRef
    }

    setName = () => {
        const name = this.inputRef.value
        this.props.userActions.selectName({ userName: name })
    }

    render() {
        if (this.props.userName === '') {
            return (
                <div>
                    <LoginPageComponent onSetNameClick={this.setName} setInputRef={this.setInputRef} onInputChange={this.onInputChange}/>
                </div>
            )
        }
        return <GameList />
    }
}

const mapStateToProps = ({ user }) => ({
    userName: user.userName,
})
const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators({ selectName }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
