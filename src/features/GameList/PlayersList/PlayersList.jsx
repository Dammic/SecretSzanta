import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PlayersListComponent from './PlayersListComponent'

class PlayersList extends PureComponent {
    static propTypes = {
  
   
    }

    render() {
        const fakePlayers = [
            {
                playerName: 'testplayer1',
                currentRoom: 'testroom1',
                avatarNumber: 1,
            },
            {
                playerName: 'testplayer3',
                avatarNumber: 3,
            },
            {
                playerName: 'testplayer2',
                currentRoom: 'testroom2',
                avatarNumber: 2,
            },
        ]
        return (
            <PlayersListComponent
                players={fakePlayers}
            />
        )
    }
}

const mapStateToProps = () => ({

})

export default connect(mapStateToProps)(PlayersList)
