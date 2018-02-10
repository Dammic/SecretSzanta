import React from 'react'
import CreateGameModalComponent from './CreateGameModalComponent'
import { socket } from '../../../utils/SocketHandler'

const { SocketEvents } = require('../../../../Dictionary')

export class CreateGameModal extends React.PureComponent {
    state = {
        roomName: '',
        password: '',
        numberOfPlayers: 10,
    }

    onChange = property => (event => this.setState({ [property]: event.target.value }))
    onRoomNameChange = this.onChange('roomName')
    onPasswordChange = this.onChange('password')
    onNumberOfPlayersChange = this.onChange('numberOfPlayers')

    onCreate = () => {
        console.log("Create")
        const { roomName, password, numberOfPlayers } = this.state
        console.log(roomName, password, numberOfPlayers)
        socket.emit(SocketEvents.CLIENT_CREATE_ROOM, {
            roomName,
            maxPlayers: numberOfPlayers,
            password,
        })

        this.props.closeModal()
    }

    render() {
        return (
            <CreateGameModalComponent
                onCreate={this.onCreate}
                onRoomNameChange={this.onRoomNameChange}
                onPasswordChange={this.onPasswordChange}
                onNumberOfPlayersChange={this.onNumberOfPlayersChange}
            />
        )
    }
}

