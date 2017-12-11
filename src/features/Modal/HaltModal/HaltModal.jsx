import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HaltModalComponent from './HaltModalComponent'

class HaltModal extends PureComponent {
    static propTypes = {
        hasGameEnded: PropTypes.bool,
        ownerName: PropTypes.string,
    }
    render() {
        const { ownerName, hasGameEnded } = this.props;
        return (
            <HaltModalComponent
                ownerName={ownerName}
                hasGameEnded={hasGameEnded}
            />
        )        
    }
}

const mapStateToProps = ({ room }) => {
    return {
        ownerName: room.ownerName,
    }
}

export default connect(mapStateToProps)(HaltModal)
