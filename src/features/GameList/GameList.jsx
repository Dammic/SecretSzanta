import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Views } from '../../../Dictionary'
import GameListComponent from './GameListComponent'
import { joinRoom, setView } from '../../ducks/userDuck'
import { clearChat } from '../../ducks/chatDuck'
import { rooms } from '../../const/roomMock'

export class GameList extends React.PureComponent {
    static propTypes = {
        // redux
        userActions: PropTypes.objectOf(PropTypes.func),
        roomName: PropTypes.string,
        userName: PropTypes.string,
    }

    setRoomName = (event) => {
        const roomID = event.target.attributes.getNamedItem('data-roomid').value
        this.props.userActions.joinRoom({ roomName: roomID })
        this.props.chatActions.clearChat()
        this.props.userActions.setView({ viewName: Views.Game })
    }

    render() {
        const { userName } = this.props
        return (
            <GameListComponent
                userName={userName}
                rooms={rooms}
                onClick={this.setRoomName}
            />
        )
    }
}

const mapStateToProps = ({ user }) => ({
    userName: user.userName,
    roomName: user.roomName,
})
const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators({ joinRoom, setView }, dispatch),
    chatActions: bindActionCreators({ clearChat }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameList)
