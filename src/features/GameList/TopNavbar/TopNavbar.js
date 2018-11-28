import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setModal } from '../../../ducks/modalDuck'
import { TopNavbarComponent } from './TopNavbarComponent'

class TopNavbar extends PureComponent {
    onShowModal = () => {
        this.props.setModal({
            title: 'Create new game',
            isCloseButtonShown: true,
            isOverlayOpaque: true,
            componentName: 'CreateGameModal',
        })
    }

    render() {
        return (
            <TopNavbarComponent
                onShowModal={this.onShowModal}
            />
        )
    }
}

TopNavbar.propTypes = {
    setModal: PropTypes.func,
}

const mapDispatchToProps = dispatch => ({
    setModal: modalOptions => dispatch(setModal(modalOptions)),
})

export default connect(null, mapDispatchToProps)(TopNavbar)
