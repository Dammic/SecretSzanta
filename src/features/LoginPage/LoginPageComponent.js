'use strict'
import React from 'react'
import Modal from '../Modal/Modal'

const LoginPageComponent = ({
    onSetNameClick,
    setInputRef
}) => {
    return (
        <div className="login-page">
            <Modal>
                Akk
            </Modal>
            <img className="logo" src="Logo.png"/>
            <div className="login-form">
                <input ref={setInputRef} type="text" name="firstname" placeholder=""/>
                <button onClick={onSetNameClick}>Ok</button>
            </div>
        </div>
    )
}

export default LoginPageComponent
