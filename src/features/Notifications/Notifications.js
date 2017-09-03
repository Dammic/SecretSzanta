import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import { map, take} from 'lodash'
import { MessagesTypes } from '../../../Dictionary'
import * as infoTreeActions from '../../ducks/informationReportingDuck'

export class InformationPanels extends React.PureComponent {
    render() {
        const panels = map(take(this.props.information, 3), (info) => {
            const isError = info.type === MessagesTypes.ERROR_NOTIFICATION

            return (
                <Panel
                    key={`panel-${info.id}`} 
                    id={ info.id }
                    message={ info.message }
                    isError={ isError }
                    deleteInformation={ this.props.infoActions.deleteInformation } 
                />
            )
        })

        return (
            <div className="information-panels" >
                {panels}
            </div>
        )
    }
}

export class Panel extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
        this.props.deleteInformation(this.props.id)
    }

    render() {
        const { id, isError, message} = this.props
        return (
            <div className={classNames("information-panel", {error : isError})}> 
                {message}
                <div className="information-panel-exit" onClick={ this.handleClose }>x</div>
            </div>
        )
    }
}

const mapStateToProps = ({ infoTree }) => ({
    information: infoTree.information,
})
const mapDispatchToProps = dispatch => ({
    infoActions: bindActionCreators(infoTreeActions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(InformationPanels)
