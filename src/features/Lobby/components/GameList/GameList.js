import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import { socket } from '../../../../utils/SocketHandler'
import { SocketEvents } from '../../../../../Dictionary'
import { setRoomName } from '../../../../ducks/userDuck'
import { GameListComponent } from './GameListComponent'
import { NoResults } from './components/NoResults'

export class GameList extends React.PureComponent {
    static propTypes = {
        // redux
        rooms: PropTypes.objectOf(PropTypes.any),
        setRoom: PropTypes.func.isRequired,
    }

    setRoomName = (event) => {
        const roomId = event.target.attributes.getNamedItem('data-roomid').value
        this.props.setRoom({ roomName: roomId })
        socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { roomName: roomId })
    }

    render() {
        const { rooms } = this.props

        if (!rooms || size(rooms) === 0) {
            return <NoResults />
        }

        return (
            <GameListComponent rooms={rooms} onClick={this.setRoomName} />
        )
    }
}

const mapStateToProps = ({ lobby }) => ({
    rooms: lobby.roomsList,
})

const mapDispatchToProps = dispatch => ({
    setRoom: roomId => dispatch(setRoomName(roomId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GameList)
