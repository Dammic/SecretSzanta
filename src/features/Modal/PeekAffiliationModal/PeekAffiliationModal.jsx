import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { SocketEvents } from '../../../../Dictionary'
import PeekAffiliationModalComponent from './PeekAffiliationModalComponent'
import { socket } from '../../../utils/SocketHandler'

export class PeekAffiliationModal extends PureComponent {
    static propTypes = {
        data: PropTypes.object,
        closeModal: PropTypes.func,
    };

    onModalClose = () => {
        socket.emit(SocketEvents.SuperpowerAffiliationPeekEnd)
        this.props.closeModal()
    }

    render() {
        const { data: { playerInfo } } = this.props
        return (
            <PeekAffiliationModalComponent
                closeModal={this.onModalClose}
                avatarNumber={playerInfo.avatarNumber}
                playerName={playerInfo.playerName}
                affiliation={playerInfo.affiliation}
            />
        )
    }
}

export default PeekAffiliationModal
