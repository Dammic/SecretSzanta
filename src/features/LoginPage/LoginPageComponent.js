import React from 'react'
import PropTypes from 'prop-types'
import { getAvatar } from '../../utils/avatarsHelper'
import { ControlButton } from '../Shared/Buttons'

import styles from './LoginPage.module.css'

const LoginPageComponent = ({
    onSetNameClick,
    setInputRef,
    onInputChange,
    userName,
    onNameReset,
}) => {
    const avatar2 = getAvatar('liberal-2')
    const avatar3 = getAvatar('liberal-3')
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginFormContainer}>
                <div className={styles.loginForm}>
                    {!userName && (
                        <div>
                            <div className={styles.loginInputGroup}>
                                <input
                                    ref={setInputRef}
                                    type="text"
                                    name="firstname"
                                    placeholder=""
                                    onKeyPress={onInputChange}
                                    autoFocus
                                />
                                <ControlButton onClick={onSetNameClick}>Log in</ControlButton>
                            </div>
                            <p className={styles.formText}>
                                Get right in the game by typing in your desired nickname.
                            </p>
                        </div>
                    )}
                    {userName && (
                        <div className={styles.formText}>
                            <div>You are currently logged as<span className={styles.userName}>{` ${userName}`}</span></div>
                            <div>Click <span className={styles.changeNickname} onClick={onNameReset}>here</span> to change nickname</div>
                        </div>
                    )}

                    <div className={styles.formText}>
                        <p>
                            Rto soluta numquam et, eu vix paulo bonorum.
                            Id vidit etiam argumentum mea. Mundi virtute eu vim,
                            vel at stet lorem delectus, phaedrum adipisci eum et.
                        </p>
                    </div>
                </div>
            </div>
            <img src={avatar3} alt="avatar" className={styles.homeImageLarge} />
            <img src={avatar2} alt="avatar" className={styles.homeImageSmall} />
            <div className={styles.homeContent}>

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
