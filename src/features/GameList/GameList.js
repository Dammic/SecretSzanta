import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { socket } from '../../utils/SocketHandler'
import { SocketEvents } from '../../../Dictionary'
import GameListComponent from './GameListComponent'
import { setRoomName } from '../../ducks/userDuck'

export class GameList extends React.PureComponent {
    static propTypes = {
        // redux
        userName: PropTypes.string,
        roomsList: PropTypes.objectOf(PropTypes.any),
    }

    setRoomName = (roomId) => {
        this.props.setRoom({ roomName: roomId })
        socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { playerName: this.props.userName, roomName: roomId })
    }

    render() {
        const { userName, roomsList } = this.props
        return (
            <GameListComponent
                userName={userName}
                rooms={roomsList}
                onClick={this.setRoomName}
            />
        )
    }
}

const mapStateToProps = ({ user, lobby }) => ({
    userName: user.userName,
    roomsList: lobby.roomsList,
})

const mapDispatchToProps = dispatch => ({
    setRoom: roomId => dispatch(setRoomName(roomId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GameList)
