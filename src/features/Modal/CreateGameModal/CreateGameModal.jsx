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

    onChange = event => this.setState({ [event.target.name]: event.target.value })

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
        const { roomName, password, maxPlayers } = this.state
        return (
            <CreateGameModalComponent
                {...{ roomName, password, maxPlayers }}
                onCreate={this.onCreate}
                onChange={this.onChange}
            />
        )
    }
}

