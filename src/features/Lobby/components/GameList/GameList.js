import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import { socket } from '../../../../utils/SocketHandler'
import { SocketEvents } from '../../../../../Dictionary'
import { GameListComponent } from './GameListComponent'
import { NoResults } from './components/NoResults'

const joinRoom = (roomId) => {
    socket.emit(SocketEvents.CLIENT_JOIN_ROOM, { roomName: roomId })
}

export class GameList extends React.PureComponent {
    static propTypes = {
        // redux
        rooms: PropTypes.objectOf(PropTypes.any),
    }

    render() {
        const { rooms } = this.props

        if (!rooms || size(rooms) === 0) {
            return <NoResults />
        }

        return (
            <GameListComponent rooms={rooms} onClick={joinRoom} />
        )
    }
}

const mapStateToProps = ({ lobby }) => ({
    rooms: lobby.roomsList,
})

export default connect(mapStateToProps)(GameList)
