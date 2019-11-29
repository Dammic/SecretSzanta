import { map, pick } from 'lodash'
import { SocketEvents, PlayerAffilications } from '../../../Dictionary'
import { emitToPlayer } from './generic'

import {
    getPlayersCount,
} from '../../utils/RoomsManager'

export const emitBecomeFascistToPlayer = (room, player, fascists) => {
    const playerCount = getPlayersCount(room)
    const shouldHideOtherFacists = player.affiliation === PlayerAffilications.HITLER_AFFILIATION && playerCount > 6
    const facistSubproperties = ['playerName', 'affiliation', 'facistAvatar']
    const passedFacists = map(fascists, fascist => pick(fascist, facistSubproperties))

    emitToPlayer(player.emit, SocketEvents.BECOME_FACIST, {
        facists: (shouldHideOtherFacists
            ? pick(player, facistSubproperties)
            : passedFacists
        ),
    })
}
