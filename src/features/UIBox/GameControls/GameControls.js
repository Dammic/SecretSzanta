import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GameControlsComponent from './GameControlsComponent'
import { toggleAffiliationMenu } from '../../../ducks/userDuck'
import { startGame, startKickPlayerMode, startBanPlayerMode } from '../../../gameLogic/ownerActions'

export class GameControls extends React.PureComponent {
    static displayName = 'GameControls'
    static propTypes = {
        toggleAffiliationMenu: PropTypes.func.isRequired,
        gamePhase: PropTypes.string,
        isOwner: PropTypes.bool,
        isAffiliationHidden: PropTypes.bool,
    }

    toggleShow = () => {
        this.props.toggleAffiliationMenu()
    }

    render() {
        const { gamePhase, isAffiliationHidden, isOwner } = this.props
        return (
            <GameControlsComponent
                onStartGame={startGame}
                onKickPlayer={startKickPlayerMode}
                onBanPlayer={startBanPlayerMode}
                onShowAffiliationClick={this.toggleShow}
                isOwner={isOwner}
                gamePhase={gamePhase}
                isAffiliationHidden={isAffiliationHidden}
            />
        )
    }
}

const mapStateToProps = ({ user, room }) => ({
    userName: user.userName,
    isAffiliationHidden: user.isAffiliationHidden,
    isOwner: room.ownerName === user.userName,
    gamePhase: room.gamePhase,
})

const mapDispatchToProps = dispatch => ({
    toggleAffiliationMenu: () => dispatch(toggleAffiliationMenu()),
})
export default connect(mapStateToProps, mapDispatchToProps)(GameControls)
