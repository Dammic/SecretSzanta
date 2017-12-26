import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ModalComponent from './ModalComponent'
import * as modalActions from '../../ducks/modalDuck'
import WinningModal from './WinningModal/WinningModal'
import VotingModal from './VotingModal/VotingModal'
import PolicyChoiceModal from './PolicyChoiceModal/PolicyChoiceModal'
import HaltModal from './HaltModal/HaltModal'

const modalInnerComponents = {
    VotingModal,
    PolicyChoiceModal,
    WinningModal,
    HaltModal,
}

class Modal extends React.PureComponent {
    static propTypes = {
        // redux
        isVisible: PropTypes.bool,
        title: PropTypes.string,
        overlayClosesModal: PropTypes.bool,
        isCloseButtonShown: PropTypes.bool,
        isOverlayOpaque: PropTypes.bool,
        componentName: PropTypes.string,
        modalTmpData: PropTypes.objectOf(PropTypes.any),
        modalActions: PropTypes.objectOf(PropTypes.func),
    }

    closeModal = () => {
        this.props.modalActions.toggleModal({ value: false })
    }

    render() {
        const { isVisible, title, overlayClosesModal, isCloseButtonShown, isOverlayOpaque, componentName, modalTmpData } = this.props
        const ModalInnerComponent = modalInnerComponents[componentName]
        if (!ModalInnerComponent) {
            return null
        }
        return (
            <ModalComponent
                isVisible={isVisible}
                title={title}
                overlayClosesModal={overlayClosesModal}
                isCloseButtonShown={isCloseButtonShown}
                isOverlayOpaque={isOverlayOpaque}
                closeModal={this.closeModal}
                child={<ModalInnerComponent data={modalTmpData} closeModal={this.closeModal} />}
            />
        )
    }
}

const mapStateToProps = ({ modal }) => ({
    isVisible: modal.isVisible,
    title: modal.title,
    overlayClosesModal: modal.overlayClosesModal,
    isCloseButtonShown: modal.isCloseButtonShown,
    isOverlayOpaque: modal.isOverlayOpaque,
    componentName: modal.componentName,
    modalTmpData: modal.modalTmpData,
})
const mapDispatchToProps = dispatch => ({
    modalActions: bindActionCreators(modalActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(Modal)
