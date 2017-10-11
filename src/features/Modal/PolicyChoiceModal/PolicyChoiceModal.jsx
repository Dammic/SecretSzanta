import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PolicyChoiceModalComponent from './PolicyChoiceModalComponent'
import { SocketEvents } from '../../../../Dictionary'
import { socket } from '../../../utils/SocketHandler'
import { toggleVotingModal } from '../../../ducks/roomDuck'

export class PolicyChoiceModal extends React.PureComponent {
    static propTypes = {
        // parent
        data: PropTypes.shape({
            policies: PropTypes.arrayOf(PropTypes.string).required,
        }),

        // redux
        toggleVotingModal: PropTypes.func.required,
    }

    onPolicyChoice = (event) => {
        const { data: { policies } } = this.props
        const index = event.target.getAttribute('data-index')
        const choice = policies[index]
        socket.emit(SocketEvents.ChoosePolicy, { choice })
        this.props.toggleVotingModal()
    }

    render() {
        const { data: { policies } } = this.props
        return (
            <PolicyChoiceModalComponent
                policies={policies}
                onClick={this.onPolicyChoice}
            />
        )
    }
}

const mapStateToProps = ({ room }) => ({
    policies: room.policies,
})
const mapDispatchToProps = dispatch => ({
    toggleVotingModal: () => dispatch(toggleVotingModal),
})

export default connect(mapStateToProps, mapDispatchToProps)(PolicyChoiceModal)
