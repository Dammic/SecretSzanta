import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setModal } from '../../../../ducks/modalDuck'
import { TopNavbarComponent } from './TopNavbarComponent'

export class TopNavbar extends PureComponent {
    static propTypes = {
        setModal: PropTypes.func,
        userName: PropTypes.string,
    }

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
                userName={this.props.userName}
            />
        )
    }
}

const mapStateToProps = ({ user }) => ({
    userName: user.userName,
})

const mapDispatchToProps = dispatch => ({
    setModal: modalOptions => dispatch(setModal(modalOptions)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopNavbar)
