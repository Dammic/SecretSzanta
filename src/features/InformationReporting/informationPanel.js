import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'lodash'

export class InformationPanel extends React.PureComponent {
    render() {
        const panels = map(this.props.information, info => {
            return (
                <div key={'panel-${info.id}'} className="informationPanel"> 
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
