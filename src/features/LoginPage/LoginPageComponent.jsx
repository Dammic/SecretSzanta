import React from 'react'
import PropTypes from 'prop-types'

const LoginPageComponent = ({
    onSetNameClick,
    setInputRef,
    onInputChange,
}) => {
    return (
        <div className="login-page">
            <div className="login-form-container">
                <div className="login-form">
                    <div className="login-input-group">
                        <input ref={setInputRef} type="text" name="firstname" placeholder="" onKeyPress={onInputChange} autoFocus />
                        <button onClick={onSetNameClick}>Ok</button>
                    </div>
                </div>
            </div>
            <div className="home-content">

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
