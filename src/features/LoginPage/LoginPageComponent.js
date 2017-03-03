'use strict'
import React from 'react'

const LoginPageComponent = ({title, userNames, onSetNameClick}) => {
    console.info(userNames)
    return (
        <div className="login-page">
            aaa
            <form className="login-form">
                <input type="text" name="firstname" value="Mickey"/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default LoginPageComponent
