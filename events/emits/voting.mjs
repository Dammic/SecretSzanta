import lodash from 'lodash'
import { SocketEvents, MessagesTypes } from '../../Dictionary'
import { emitToRoom, emitGameNotification } from './generic'

const { truncate } = lodash

import {
    getRemainingVotesCount,
    getRemainingVotingPlayers,
    getChancellor,
    getVotes,
    getVotingResult,
} from '../../utils/RoomsManager'

export const emitNewVote = (room, playerName) => {
    const remainingPlayers = getRemainingVotingPlayers(room)
    if (remainingPlayers.length) {
        const messageContent = `${getRemainingVotesCount(room)} votes left. Waiting for [${truncate(remainingPlayers.join(', '), 40)}]`
        emitGameNotification(room, MessagesTypes.STATUS, messageContent)
    }

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
