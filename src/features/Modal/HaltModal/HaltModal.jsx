import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HaltModalComponent from './HaltModalComponent'

class HaltModal extends PureComponent {
    static propTypes = {
        end: PropTypes.bool,
        owner: PropTypes.string,
    }
    render() {
        return (<HaltModalComponent
                owner={this.props.owner}
                end={this.props.end}
            / >)        
    }
}

const mapStateToProps = ({ room }) => {
    return {
        owner: room.ownerName,
    }
}

export default connect(mapStateToProps)(HaltModal)
