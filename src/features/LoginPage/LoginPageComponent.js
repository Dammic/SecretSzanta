'use strict'
import React from 'react'


const LoginPageComponent = ({
    onSetNameClick
}) => {
    return (
        <div className="login-page">
            <img className="logo" src="Logo.png"/>
            <div className="login-form">
                <input type="text" name="firstname" placeholder=""/>
                <button onClick={onSetNameClick}>Ok</button>
            </div>
        </div >
    )
}

export default LoginPageComponent