import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { socket } from '../../utils/SocketHandler'
import { SocketEvents } from '../../../Dictionary'
import GameListComponent from './GameListComponent'
import { rooms } from '../../const/roomMock'
import { setRoomId } from '../../ducks/roomDuck'

export class GameList extends React.PureComponent {
    static propTypes = {
        // redux
        userName: PropTypes.string,
        roomsList: PropTypes.objectOf(PropTypes.any),
    }

    setRoomName = (event) => {
        const roomID = event.target.attributes.getNamedItem('data-roomid').value
        this.props.setRoom({ roomId: roomID })
        socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { playerName: this.props.userName, roomName: roomID })
    }

    render() {
        const { userName, roomsList } = this.props
        return (
            <GameListComponent
                userName={userName}
                // when time comes, you can rooms swap it with roomsList from store
                rooms={rooms}
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
    setRoom: dispatch(setRoomId),
})

export default connect(mapStateToProps, mapDispatchToProps)(GameList)
