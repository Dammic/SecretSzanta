import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { SocketEvents } from '../../../Dictionary'
import LoginPageComponent from './LoginPageComponent'
import { socket } from '../../utils/SocketHandler'

export class LoginPage extends React.PureComponent {
    static propTypes = {
        // redux
        userName: PropTypes.string,
        userActions: PropTypes.objectOf(PropTypes.func),
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

    resetName = () => {
        socket.emit(SocketEvents.SelectName, { userName: '' })
    }

    setName = () => {
        const name = this.inputRef.value
        socket.emit(SocketEvents.SelectName, { userName: name })
    }

    render() {
        const { userName } = this.props
        return (
            <LoginPageComponent
                onSetNameClick={this.setName}
                setInputRef={this.setInputRef}
                onInputChange={this.onInputChange}
                userName={userName}
                onNameReset={this.resetName}
            />
        )
    }
}
const mapStateToProps = ({ user: { userName } }) => ({
    userName,
})
export default connect(mapStateToProps)(LoginPage)
