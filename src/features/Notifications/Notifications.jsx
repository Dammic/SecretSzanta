import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import { map, take } from 'lodash'
import { NotificationPanel } from './NotificationPanel'
import { MessagesTypes } from '../../../Dictionary'
import * as infoTreeActions from '../../ducks/notificationsDuck'

export class Notifications extends React.PureComponent {
    render() {
        const panels = map(take(this.props.information, 3), (info) => {
            const isError = info.type === MessagesTypes.ERROR_NOTIFICATION

            return (
                <NotificationPanel
                    key={`panel-${info.id}`}
                    id={info.id}
                    message={info.message}
                    isError={isError}
                    deleteInformation={this.props.infoActions.deleteInformation} 
                />
            )
        })

        return (
            <div className="notifications" >
                {panels}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
