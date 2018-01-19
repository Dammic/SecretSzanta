import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get, pullAt } from 'lodash'
import PolicyChoiceModalComponent from './PolicyChoiceModalComponent'
import { SocketEvents, PlayerRole } from '../../../../Dictionary'
import { socket } from '../../../utils/SocketHandler'

export class PolicyChoiceModal extends React.PureComponent {
    static propTypes = {
        // parent
        data: PropTypes.shape({
            policies: PropTypes.arrayOf(PropTypes.string).isRequired,
            selectable: PropTypes.bool,
        }),
        closeModal: PropTypes.func.isRequired,
    }

    onPolicyChoice = (event) => {
        const { data: { policies } } = this.props
        const index = event.target.getAttribute('data-index')
        const choice = policies[index]

        socket.emit(SocketEvents.ChoosePolicy, { choice })
        this.props.closeModal()
    }

    onButtonClose = () => {
        socket.emit(SocketEvents.EndPeekCardsPhase)
        this.props.closeModal()
    }

    render() {
        const { data: { policies, selectable = true } } = this.props
        return (
            <PolicyChoiceModalComponent
                policies={policies}
                onClick={selectable ? this.onPolicyChoice : undefined}
                selectable={selectable}
                onButtonClose={this.onButtonClose}
            />
        )
    }
}

const mapStateToProps = ({ room: { policies } }) => ({
    policies,
})

export default connect(mapStateToProps)(PolicyChoiceModal)
