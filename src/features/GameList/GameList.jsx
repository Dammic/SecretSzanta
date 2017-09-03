import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GameListComponent from './GameListComponent'
import GameRoom from '../GameRoom/GameRoom'
import InformationPanels from '../InformationReporting/informationPanel'
import { joinRoom } from '../../ducks/userDuck'
import * as infoTreeActions from '../../ducks/informationReportingDuck'
import SocketHandler from '../../utils/SocketHandler'
import Modal from '../Modal/Modal'

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

    componentDidMount = () => {
        this.props.messageActions.addInformation('Ha! Działa :)')
        this.props.messageActions.addError('Ohh! NO! An Error!')
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
                <InformationPanels infos={['Informacja!']}/>
                <SocketHandler />
                <Modal />
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
    messageActions: bindActionCreators(infoTreeActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameList)
