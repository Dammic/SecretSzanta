import {
    reject,
    countBy,
    isNil,
    forEach,
    size,
    includes,
    map,
    keys,
} from 'lodash'
import { getRoom, updateRoom } from '../../stores'
import { getAlivePlayers } from './players'
import { PlayerRole } from '../../../Dictionary'

export const initializeVoting = (roomName, chancellorCandidateName) => {
    updateRoom(roomName, {
        votes: {},
        chancellorCandidateName,
    })
}

export const vote = (roomName, playerName, value) => {
    const { playersDict } = getRoom(roomName)
    if (!playersDict[playerName].isDead) {
        updateRoom(roomName, { votes: { [playerName]: value } })
    }
}

export const getRemainingVotesCount = (roomName) => {
    const { votes, playersDict } = getRoom(roomName)
    const votingPlayers = reject(playersDict, { isDead: true })
    return size(votingPlayers) - size(votes)
}

export const getRemainingVotingPlayers = (roomName) => {
    const { votes, playersDict } = getRoom(roomName)
    const votingPlayersNames = map(reject(playersDict, { isDead: true }), 'playerName')
    const filteredVotes = reject(votingPlayersNames, (key) => includes(keys(votes), key))
    return filteredVotes
}

export const didAllVote = (roomName) => {
    return size(getRemainingVotingPlayers(roomName)) === 0
}

export const getVotes = (roomName) => {
    return getRoom(roomName).votes
}

export const getVotingResult = (roomName) => {
    const { votes } = getRoom(roomName)
    const votesCount = countBy(votes)
    return ((votesCount[true] > votesCount[false]) || !votesCount[false])
}

const isEligeable = (player, numberOfPlayers) => {
    const eligeable = isNil(player.role) || (numberOfPlayers <= 5 && player.role == PlayerRole.ROLE_PREVIOUS_PRESIDENT)
    return eligeable
}

export const getChancellorChoices = (roomName) => {
    const alivePlayersDict = getAlivePlayers(roomName)
    const chancellorChoices = []
    const numberOfPlayers = size(alivePlayersDict)
    forEach(alivePlayersDict, (player) => {
        if (isEligeable(player, numberOfPlayers)) {
            chancellorChoices.push(player.playerName)
        }
    })
    return chancellorChoices
}
