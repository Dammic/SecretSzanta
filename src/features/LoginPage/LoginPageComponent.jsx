import React from 'react'
import PropTypes from 'prop-types'
import Avatar2 from '../../static/Avatar2.png'
import Avatar1 from '../../static/Avatar1.png'

const LoginPageComponent = ({
    onSetNameClick,
    setInputRef,
    onInputChange,
    userName,
    onNameReset,
}) => {
    return (
        <div className="login-page">
            <div className="login-form-container">
                <div className="login-form">
                    {!userName && <div>
                        <div className="login-input-group">
                            <input ref={setInputRef} type="text" name="firstname" placeholder="" onKeyPress={onInputChange} autoFocus />
                            <button onClick={onSetNameClick}>Ok</button>
                        </div>
                        <div className="form-text">
                            <p>
                                Get right in the game by typing in your desired nickname.
                            </p>
                        </div>
                    </div>}
                    {userName && <div className="form-text">
                        <div>You are currently logged as<span className="user-name">{' '}{userName}</span></div>
                        <div>Click <span className="change-nickname" onClick={onNameReset}>here</span> to change nickname</div>
                    </div>}
                    
                    <div className="form-text">
                        <p>
                            Rto soluta numquam et, eu vix paulo bonorum.
                            Id vidit etiam argumentum mea. Mundi virtute eu vim,
                            vel at stet lorem delectus, phaedrum adipisci eum et.
                        </p>
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
    userName: PropTypes.string,
    onSetNameClick: PropTypes.func,
    setInputRef: PropTypes.func,
    onInputChange: PropTypes.func,
    onNameReset: PropTypes.func,
}
export default LoginPageComponent
