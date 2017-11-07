import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Views } from '../../../Dictionary'
import LoginPageComponent from './LoginPageComponent'
import { selectName, setView } from '../../ducks/userDuck'

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
        this.props.userActions.selectName({ userName: '' })
    }

    setName = () => {
        const name = this.inputRef.value
        this.props.userActions.selectName({ userName: name })
        this.props.userActions.setView({ viewName: Views.Lobby })
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
const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators({ selectName, setView }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
