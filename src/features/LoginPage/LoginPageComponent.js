'use strict'
import React from 'react'

const LoginPageComponent = ({
    onSetNameClick,
    setInputRef,
    onInputChange
}) => {
    return (
        <div className="login-page">
            <div className="login-form">
                <input ref={setInputRef} type="text" name="firstname" placeholder="" onKeyPress={onInputChange}/>
                <button onClick={onSetNameClick}>Ok</button>
            </div>
        </div >
    )
}

export default LoginPageComponent
