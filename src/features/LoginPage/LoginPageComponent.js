import React from 'react'
import PropTypes from 'prop-types'

const LoginPageComponent = ({
    onSetNameClick,
    setInputRef,
    onInputChange,
}) => {
    return (
        <div className="login-page">
            <div className="login-form">
                <input ref={setInputRef} type="text" name="firstname" placeholder="" onKeyPress={onInputChange} autofocus />
                <button onClick={onSetNameClick}>Ok</button>
            </div>
        </div>
    )
}

LoginPageComponent.propTypes = {
    onSetNameClick: PropTypes.func,
    setInputRef: PropTypes.func,
    onInputChange: PropTypes.func,
}
export default LoginPageComponent
