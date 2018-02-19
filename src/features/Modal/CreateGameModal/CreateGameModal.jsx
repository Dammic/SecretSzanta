import React from 'react'
import PropTypes from 'prop-types'
import CreateGameModalComponent from './CreateGameModalComponent'
import { socket } from '../../../utils/SocketHandler'

import { SocketEvents } from '../../../../Dictionary'

export class CreateGameModal extends React.PureComponent {
    propTypes = {
        closeModal: PropTypes.func,
    }

    state = {
        roomName: '',
        password: '',
        maxPlayers: 10,
    }

    onChange = property => (event => this.setState({ [property]: event.target.value }))
    onRoomNameChange = this.onChange('roomName')
    onPasswordChange = this.onChange('password')
    onMaxPlayersChange = this.onChange('maxPlayers')

    onCreate = () => {
        const { roomName, password, maxPlayers } = this.state
        socket.emit(SocketEvents.CLIENT_CREATE_ROOM, {
            roomName,
            maxPlayers,
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
                onMaxPlayersChange={this.onMaxPlayersChange}
            />
        )
    }
}

