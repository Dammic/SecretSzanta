import lodash from 'lodash'
import { roomsStore } from '../../stores'
import { getAlivePlayers } from './players.mjs';
import { PlayerRole } from '../../Dictionary'

const {
    reject,
    countBy,
    isNil,
    forEach,
    size,
    includes,
    map,
    filter,
    keys,
} = lodash

export const initializeVoting = (roomName, chancellorCandidateName) => {
    roomsStore[roomName].votes = {}
    roomsStore[roomName].chancellorCandidateName = chancellorCandidateName
}

export const vote = (roomName, playerName, value) => {
    const { playersDict, votes } = roomsStore[roomName]
    if (!playersDict[playerName].isDead) {
        votes[playerName] = value
    }
}

export const didAllVote = (roomName) => {
    return size(getRemainingVotingPlayers(roomName)) === 0;
}

export const getRemainingVotesCount = (roomName) => {
    const { votes, playersDict } = roomsStore[roomName]
    const votingPlayers = reject(playersDict, { isDead: true })
    return size(votingPlayers) - size(votes)
}

export const getRemainingVotingPlayers = (roomName) => {
    const { votes, playersDict } = roomsStore[roomName]
    const votingPlayersNames = map(reject(playersDict, { isDead: true }), 'playerName')
    const filteredVotes = reject(votingPlayersNames, (key) => includes(keys(votes), key))
    return filteredVotes
}

export const getVotes = (roomName) => {
    return roomsStore[roomName].votes
}

export const getVotingResult = (roomName) => {
    const { votes } = roomsStore[roomName]
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
    console.log("numberOfPlayers =", numberOfPlayers)
    forEach(alivePlayersDict, (player) => {
        if (isEligeable(player, numberOfPlayers)) {
            chancellorChoices.push(player.playerName)
        }
    })
    return chancellorChoices
}
