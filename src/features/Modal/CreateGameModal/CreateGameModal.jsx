import React from 'react'
import { connect } from 'react-redux'
import CreateGameModalComponent from './CreateGameModalComponent'
import { socket } from '../../../utils/SocketHandler'
import { joinRoom } from '../../../ducks/userDuck'
import { bindActionCreators } from 'redux'

const { SocketEvents } = require('../../../../Dictionary')


export class CreateGameModal extends React.PureComponent {
    onChange = (event) => {
        console.log("Change")
        const name = event.target.getAttribute('name')
        const value = event.target.value
        this.props.setModalData(name, value)
    }
    onClick = () => {
        console.log("Create")
        const {room_name, password, number_of_players} = this.props.data
        console.log(room_name, password, number_of_players)
        socket.emit(SocketEvents.CLIENT_CREATE_ROOM, {
            roomName: room_name,
            maxPlayers: number_of_players,
            password,
        })
        this.props.userActions.joinRoom(room_name)
        this.props.closeModal()
    }

    render () {
        return (
            <CreateGameModalComponent onChange={this.onChange} onClick={this.onClick} />
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators({ joinRoom }, dispatch),
    }
}
export default connect(null, mapDispatchToProps)(CreateGameModal)