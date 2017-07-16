import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GameListComponent from './GameListComponent'
import GameRoom from '../GameRoom/GameRoom'
import { joinRoom } from '../../ducks/userDuck'
import SocketHandler from '../../utils/SocketHandler'

export class GameList extends React.PureComponent {
    static propTypes = {
        // redux
        userActions: PropTypes.objectOf(PropTypes.func),
        roomName: PropTypes.string,
        userName: PropTypes.string,
    }

    setRoomName = (event) => {
        const roomID = event.target.attributes.getNamedItem('data-roomid').value
        this.props.userActions.joinRoom(roomID)
    }

    render() {
        const { userName, roomName } = this.props
        this.rooms = [
            {
                roomID: 0,
                roomName: 'example',
                playerCount: 10,
            },
            {
                roomID: 1,
                roomName: 'Bad Example',
                playerCount: 10,
            },
            {
                roomID: 2,
                roomName: 'Wrong GameRoom',
                playerCount: 10,
            },
            {
                roomID: 3,
                roomName: 'Do not eneter',
                playerCount: 10,
            },
            {
                roomID: 4,
                roomName: 'Private',
                playerCount: 10,
            },
            {
                roomID: 5,
                roomName: 'Nope',
                playerCount: 10,
            },
            {
                roomID: 6,
                roomName: 'Stay out!',
                playerCount: 10,
            },
        ]
        return (
            <div>
                <SocketHandler />
                {roomName
                    ? <GameRoom />
                    : <GameListComponent userName={userName} rooms={this.rooms} onClick={this.setRoomName} />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ user }) => ({
    userName: user.userName,
    roomName: user.roomName,
})
const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators({ joinRoom }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameList)
