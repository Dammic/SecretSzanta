'use strict'
import React from 'react'
import LoginPageComponent from './LoginPageComponent'
import MainPage from '../MainPage/MainPage'
import GameList from '../GameList/GameList'
import Modal from '../Modal/Modal'

export default class LoginPage extends React.PureComponent {

    constructor (props) {
        super(props)
        this.inputRef = null
        this.state = {
            userName: '',
            isModalOpen: false
        }
    }

    setInputRef = (inpRef) => {
        this.inputRef = inpRef
    }

    closeModal = () => {
        console.info('hide!')
        this.setState({isModalOpen: false})
    }

    openModal = () => {
        this.setState({isModalOpen: true})
    }


    /**
     * Function that handles enter press
     */
    onInputChange = (event) => {
        if (event.key === 'Enter') {
            this.setName()
        }
    }

    setName = () => {
        const name = this.inputRef.value

        this.setState({
            userName: name
        })
    }

    render () {
        const {userName=''} = this.state
        if (userName === '') {
            return (
                <div>
                    <button onClick={this.openModal}>modal</button>
                    <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
                        <div>
                            <div>akk</div>
                            <div>akk</div><div>akk</div><div>akk</div>
                            <div>akk</div>





                        </div>
                    </Modal>
                    <LoginPageComponent onSetNameClick={this.setName} setInputRef={this.setInputRef} onInputChange={this.onInputChange}/>
                </div>
            )
        } else {
            return <GameList userName={userName}/>
        }
    }

}
