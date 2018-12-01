import lodash from 'lodash'
import { SocketEvents, MessagesTypes } from '../../Dictionary'
import { emitToRoom, emitGameNotification } from './generic'
import {
    getRemainingVotesCount,
    getRemainingVotingPlayers,
    getChancellor,
    getVotes,
    getVotingResult,
} from '../../utils/RoomsManager'

const { truncate } = lodash

export const emitRemainingPlayersNotification = (room) => {
    const remainingPlayers = getRemainingVotingPlayers(room)
    if (remainingPlayers.length) {
        const messageContent = '{votesLeftBold} votes left. Waiting for [{remainingPlayersBold}]'
        emitGameNotification(room, MessagesTypes.STATUS, messageContent, {
            votesLeftBold: getRemainingVotesCount(room),
            remainingPlayersBold: truncate(remainingPlayers.join(', '), 40),
        })
    }
}

export const emitNewVote = (room, playerName) => {
    emitRemainingPlayersNotification(room)

    emitToRoom(room, SocketEvents.VOTING_PHASE_NEWVOTE, {
        playerName,
    })
}

export const emitVotingResult = (room) => {
    const hasVotingSucceed = getVotingResult(room)
    const newChancellor = hasVotingSucceed ? getChancellor(room).playerName : null

    const messageContent = hasVotingSucceed
        ? `Voting succeeded - ${truncate(newChancellor, 20)} became new chancellor. Policy enacting phase will begin in 10sec...`
        : 'Voting failed! New voting round with new president will begin in 10sec...'
    emitGameNotification(room, MessagesTypes.STATUS, messageContent)

    emitToRoom(room, SocketEvents.VOTING_PHASE_REVEAL, {
        votes: getVotes(room),
        newChancellor
    })
}
