import { SocketEvents } from '../../Dictionary'
import { getCurrentTimestamp } from '../../utils/utils'

import {
    getRemainingVotesCount,
    getChancellor,
    getVotes,
    getVotingResult,
} from '../../utils/RoomsManager'
import { emitToRoom } from './generic'

export const emitNewVote = (room, playerName) => {
    emitToRoom(room, SocketEvents.VOTING_PHASE_NEWVOTE, {
        playerName,
        remaining: getRemainingVotesCount(room),
        timestamp: getCurrentTimestamp(),
    })
}

export const emitVotingResult = (room) => {
    const hasVotingSucceed = getVotingResult(room)

    emitToRoom(room, SocketEvents.VOTING_PHASE_REVEAL, {
        votes: getVotes(room),
        timestamp: getCurrentTimestamp(),
        newChancellor: (hasVotingSucceed
            ? getChancellor(room).playerName
            : null
        ),
    })
}
