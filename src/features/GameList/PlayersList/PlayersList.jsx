import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PlayersListComponent from './PlayersListComponent'

class PlayersList extends PureComponent {
    static propTypes = {
  
   
    }

    render() {
        return (
            <PlayersListComponent />
        )
    }
}

const mapStateToProps = () => ({

})

export default connect(mapStateToProps)(PlayersList)
