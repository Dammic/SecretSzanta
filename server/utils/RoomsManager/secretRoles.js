import lodash from 'lodash'
import { getRoom } from '../../stores'
import {
    PlayerAffilications,
} from '../../../Dictionary'

const {
    filter,
    includes,
    map,
    find,
    pick,
} = lodash

export const getFacists = (roomName) => {
    const { playersDict } = getRoom(roomName)
    const facistsDict = [PlayerAffilications.FACIST_AFFILIATION, PlayerAffilications.HITLER_AFFILIATION]
    return map(
        filter(playersDict, player => includes(facistsDict, player.affiliation)),
        player => pick(player, ['playerName', 'affiliation', 'facistAvatar', 'emit']),
    )
}
export const getLiberals = (roomName) => {
    const { playersDict } = getRoom(roomName)
    return filter(playersDict, { affiliation: PlayerAffilications.LIBERAL_AFFILIATION })
}
export const getHitler = (roomName) => {
    const { playersDict } = getRoom(roomName)
    return find(playersDict, { affiliation: PlayerAffilications.HITLER_AFFILIATION })
}
