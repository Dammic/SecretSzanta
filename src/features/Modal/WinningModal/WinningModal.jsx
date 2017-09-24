import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { filter, reject } from 'lodash'
import PropTypes from 'prop-types'
import WinningModalComponent from './WinningModalComponent'
import PlayerAffilications from '../../../../Dictionary'

class WinningModal extends PureComponent {
    static propTypes = {
        data: PropTypes.objectOf(PropTypes.string),
        playerDict: PropTypes.object,
    }
    render() {
        const liberalsWon = this.props.data.whoWon === PlayerAffilications.LIBERAL_AFFILIATION
        const liberals = filter(this.playerDict, { affiliation: PlayerAffilications.LIBERAL_AFFILIATION })
        const fascist = reject(this.playerDict, { affiliation: PlayerAffilications.LIBERAL_AFFILIATION })
        const winners = liberalsWon ? liberals : fascist
        const losers = liberalsWon ? fascist : liberals
        return (
            <WinningModalComponent
                winners={winners}
                losers={losers}
            />
        )
    }
}

const mapStateToProps = ({ room }) => {
    return {
        playersDict: room.playersDict,
    }
}

export default connect(mapStateToProps)(WinningModal)
