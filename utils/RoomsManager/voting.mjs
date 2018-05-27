import { roomsStore } from '../../stores'
import lodash from 'lodash'

const {
    reject,
    countBy,
    isNil,
    forEach,
    size,
    includes,
    map,
    filter
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
    const { votes, playersDict } = roomsStore[roomName]
    const votingPlayers = reject(playersDict, { isDead: true })
    const votingPlayersNames = map(votingPlayers, 'playerName')
    const filteredVotes = filter(votes, (_, key) => includes(votingPlayersNames, key))
    return size(filteredVotes) === size(votingPlayers)
}

export const getRemainingVotesCount = (roomName) => {
    const { votes, playersDict } = roomsStore[roomName]
    const votingPlayers = reject(playersDict, { isDead: true })
    return size(votingPlayers) - size(votes)
}

export const getVotes = (roomName) => {
    return roomsStore[roomName].votes
}

export const getVotingResult = (roomName) => {
    const { votes } = roomsStore[roomName]
    const votesCount = countBy(votes)
    return ((votesCount[true] > votesCount[false]) || !votesCount[false])
}

export const getChancellorChoices = (roomName) => {
    const { playersDict } = roomsStore[roomName]
    const chancellorChoices = []
    forEach(playersDict, (player) => {
        if (isNil(player.role) && !player.isDead) {
            chancellorChoices.push(player.playerName)
        }
    })
    return chancellorChoices
}
