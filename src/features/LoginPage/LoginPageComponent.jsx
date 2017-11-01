import React from 'react'
import PropTypes from 'prop-types'
import Avatar2 from '../../static/Avatar2.png'
import Avatar1 from '../../static/Avatar1.png'

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
            <img src={Avatar2} alt="avatar" className="home-image-large" />
            <img src={Avatar1} alt="avatar" className="home-image-small" />
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
