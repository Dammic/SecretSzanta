import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MessagesTypes } from '../../../Dictionary'
import classNames from 'classnames/bind'
import { map } from 'lodash'

export class InformationPanel extends React.PureComponent {
    render() {

        const panels = map(this.props.information, info => {
            const isError = info.type === MessagesTypes.ERROR_NOTIFICATION

            return (
                <div key={`panel-${info.id}`} className={classNames("informationPanel", {error : isError})}> 
                    {info.message}
                    <div className="informationPanel-exit">x</div>
                </div>
            )
        })

        return (
            <div className="informationPanels" >
                {panels}
            </div>
        )
    }
}

const mapStateToProps = ({ infoTree }) => ({
    information: infoTree.information,
})

export default connect(mapStateToProps)(InformationPanel)
