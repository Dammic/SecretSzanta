import lodash from 'lodash'
import { getRoom, updateRoom } from '../../stores'

const {
    reject,
    countBy,
    isNil,
    forEach,
    size,
    includes,
    map,
    keys,
} = lodash

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

export const getChancellorChoices = (roomName) => {
    const { playersDict } = getRoom(roomName)
    const chancellorChoices = []
    forEach(playersDict, (player) => {
        if (isNil(player.role) && !player.isDead) {
            chancellorChoices.push(player.playerName)
        }
    })
    return chancellorChoices
}
