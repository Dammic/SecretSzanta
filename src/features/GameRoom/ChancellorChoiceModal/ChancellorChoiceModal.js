import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ChancellorChoiceModalComponent from './ChancellorChoiceModalComponent'
import { SocketEvents } from '../../../../Dictionary'
import { socket } from '../../../utils/SocketHandler'
import { toggleChancellorChoiceModal } from '../../../ducks/roomDuck'

export class ChancellorChoiceModal extends React.PureComponent {
    static propTypes = {
        // redux
        roomActions: PropTypes.objectOf(PropTypes.func),
        potentialChancellorsChoices: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
        isChancellorChoiceModalShown: PropTypes.bool,
    }

    onChancellorChoice = (event) => {
        socket.emit(SocketEvents.VOTING_PHASE_START, { chancellorName: event.target.getAttribute('data-playername') })
        this.props.roomActions.toggleChancellorChoiceModal(false)
    }

    render() {
        return (
            <ChancellorChoiceModalComponent
                showModal={this.props.isChancellorChoiceModalShown}
                potentialChancellorsChoices={this.props.potentialChancellorsChoices}
                onChancellorChoice={this.onChancellorChoice}
            />
        )
    }
}

const mapStateToProps = ({ room }) => ({
    potentialChancellorsChoices: room.potentialChancellorsChoices,
    isChancellorChoiceModalShown: room.isChancellorChoiceModalShown,
})
const mapDispatchToProps = dispatch => ({
    roomActions: bindActionCreators({ toggleChancellorChoiceModal }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(ChancellorChoiceModal)
