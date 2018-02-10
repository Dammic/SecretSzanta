import React, { PureComponent } from 'react'
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
            initialData: {
                roomName: 'anotherExample',
                password: 'ble',
                maxPlayers: 6,
            },
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

const mapDispatchToProps = dispatch => ({
    setModal: obj => dispatch(setModal(obj)),
})

export default connect(null, mapDispatchToProps)(TopNavbar)
