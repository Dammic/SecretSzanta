import React from 'react'
import PropTypes from 'prop-types'
import { times, map } from 'lodash'
import classNames from 'classnames'
import { PlayerDirection } from '../../../Dictionary'
import Player from './Player/Player'
import liberalCard from '../../static/liberalcard.png'
import facistCard from '../../static/facistcard.png'
import liberalPolicies from '../../static/liberalpolicies.png'
import CurtainWrapper from './CurtainWrapper/CurtainWrapper'

import styles from './PlayerBoard.css'

const PlayerBoardComponent = ({
    playersLeft = [],
    playersMiddle = [],
    playersRight = [],
    policiesLiberalCount = 0,
    policiesFacistCount = 0,
    trackerPosition,
    trackerMoved,
    isChoiceModeVisible,
    onChoiceModeSelect,
    renderFascistPlayerBoard,
    isPlayerboardHidden,
    isModalVisible,
}) => {
    const renderPolicies = (count, cardType) => {
        const result = []
        const cardPicture = (cardType === 'liberal' ? liberalCard : facistCard)

        times(count, (index) => {
            result.push(<img key={`${cardType}-card-${index}`} src={cardPicture} alt="Policy" />)
        })

        return result
    }

    const renderPlayers = (playersList, containerClass, direction) => {
        return (
            <div className={containerClass}>
                {map(playersList, player =>
                    <Player
                        key={player.playerName}
                        player={player}
                        direction={direction}
                        onChoiceModeSelect={onChoiceModeSelect}
                    />,
                )}
            </div>
        )
    }

    const trackerFromLeftStyle = { left: `${37 + trackerPosition * 8}%` }
    const playerBoardClasses = classNames(styles.playerBoard, { [styles.blurred]: isModalVisible })

    return (
        <div className={playerBoardClasses}>
            {isChoiceModeVisible && <div className={styles.choiceOverlay} />}
            {renderPlayers(playersLeft, styles.playersContainer, PlayerDirection.PLAYER_DIRECTION_LEFT)}
            <div className={styles.centralPart}>
                {renderPlayers(playersMiddle, styles.playersContainerMiddle, PlayerDirection.PLAYER_DIRECTION_UP)}

                <div className={classNames(styles.policy, { [styles.blurred]: isChoiceModeVisible })}>
                    <CurtainWrapper isHidden={isPlayerboardHidden} />
                    <img src={liberalPolicies} />
                    <div className={styles.policyCardLiberal}>
                        {renderPolicies(policiesLiberalCount, 'liberal')}
                    </div>
                    <div className={classNames(styles.tracker, { [styles.moving]: trackerMoved })} style={trackerFromLeftStyle} />
                </div>

                <div className={classNames(styles.policy, { [styles.blurred]: isChoiceModeVisible })}>
                    <CurtainWrapper isHidden={isPlayerboardHidden} isFascist />
                    <img src={renderFascistPlayerBoard()} />
                    <div className={styles.policyCardFascist}>
                        {renderPolicies(policiesFacistCount, 'facist')}
                    </div>
                </div>
            </div>

            {renderPlayers(playersRight, styles.playersContainer, PlayerDirection.PLAYER_DIRECTION_RIGHT)}
        </div>
    )
}

PlayerBoardComponent.propTypes = {
    playersLeft: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    playersRight: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    playersMiddle: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    policiesLiberalCount: PropTypes.number,
    policiesFacistCount: PropTypes.number,
    trackerPosition: PropTypes.number,
    isChoiceModeVisible: PropTypes.bool,
    onChoiceModeSelect: PropTypes.func,
    renderFascistPlayerBoard: PropTypes.func,
    isPlayerboardHidden: PropTypes.bool,
    isModalVisible: PropTypes.bool,
}
export default PlayerBoardComponent
